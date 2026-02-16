alter table public.profiles
add column if not exists email text;

alter table public.profiles
add column if not exists username text;

update public.profiles p
set email = lower(u.email)
from auth.users u
where p.id = u.id
  and p.email is null
  and u.email is not null;

with candidates as (
  select
    p.id,
    lower(
      coalesce(
        nullif(trim(p.username), ''),
        nullif(split_part(coalesce(p.email, u.email, ''), '@', 1), ''),
        'user_' || substr(p.id::text, 1, 8)
      )
    ) as base_username
  from public.profiles p
  left join auth.users u on u.id = p.id
),
ranked as (
  select
    c.id,
    c.base_username,
    row_number() over (partition by c.base_username order by c.id) as rn
  from candidates c
)
update public.profiles p
set username = case
  when r.rn = 1 then r.base_username
  else r.base_username || '_' || substr(p.id::text, 1, 8)
end
from ranked r
where p.id = r.id
  and (p.username is null or trim(p.username) = '');

create unique index if not exists idx_profiles_username_unique
on public.profiles (lower(username));
