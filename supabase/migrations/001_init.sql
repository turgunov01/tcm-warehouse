-- Supabase migration: initial schema for tcm-warehouse

create extension if not exists pgcrypto;

create table if not exists public.zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'tenant' check (role in ('admin', 'guard', 'tenant')),
  full_name text,
  phone text,
  zone_id uuid null references public.zones(id) on delete set null,
  tenant_code text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  free_start time not null default '00:00',
  free_end time not null default '07:00',
  work_start time not null default '07:00',
  work_end time not null default '19:00',
  break_start time,
  break_end time,
  hourly_penalty numeric(12,2) not null default 60,
  debt_block_hours numeric(12,2) not null default 3,
  updated_at timestamptz not null default now()
);

create table if not exists public.closures (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid null references public.zones(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.profiles(id) on delete cascade,
  zone_id uuid not null references public.zones(id) on delete restrict,
  driver_name text not null,
  driver_passport_front text not null,
  driver_passport_back text not null,
  car_plate_photo text not null,
  car_plate_text text not null,
  requested_datetime timestamptz not null,
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  is_express boolean not null default false,
  express_fee numeric(12,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled', 'arrived', 'left', 'completed')),
  admin_note text,
  arrived_at timestamptz,
  left_at timestamptz,
  completed_at timestamptz,
  logged_in timestamptz,
  logged_out timestamptz,
  overtime_minutes integer not null default 0 check (overtime_minutes >= 0),
  penalty_amount numeric(12,2) not null default 0 check (penalty_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (slot_end > slot_start)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  recipient_id uuid null references public.profiles(id) on delete cascade,
  created_by uuid null references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.notification_reads (
  notification_id uuid not null references public.notifications(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id text,
  action text not null,
  old_data jsonb,
  new_data jsonb,
  actor_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_bookings_zone_requested on public.bookings(zone_id, requested_datetime);
create index if not exists idx_bookings_tenant_requested on public.bookings(tenant_id, requested_datetime);
create index if not exists idx_notifications_recipient_created on public.notifications(recipient_id, created_at desc);
create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);

insert into public.settings (id) values (1)
on conflict (id) do nothing;

insert into public.zones (name)
values ('Zone 1'), ('Zone 2'), ('Zone 3')
on conflict (name) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.app_role(uid uuid default auth.uid())
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role from public.profiles p where p.id = uid;
$$;

create or replace function public.app_zone(uid uuid default auth.uid())
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.zone_id from public.profiles p where p.id = uid;
$$;

create or replace function public.round_slot_30(ts timestamptz)
returns timestamptz
language sql
immutable
as $$
  select date_trunc('hour', ts) + make_interval(mins => ((extract(minute from ts)::int / 30) * 30));
$$;

create or replace function public.tenant_debt(p_tenant_id uuid)
returns numeric
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  charges numeric := 0;
  paid numeric := 0;
begin
  select coalesce(sum(b.penalty_amount + b.express_fee), 0)
  into charges
  from public.bookings b
  where b.tenant_id = p_tenant_id
    and b.status not in ('rejected', 'cancelled');

  select coalesce(sum(p.amount), 0)
  into paid
  from public.payments p
  where p.tenant_id = p_tenant_id;

  return charges - paid;
end;
$$;

grant execute on function public.tenant_debt(uuid) to authenticated;

create or replace function public.booking_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.settings%rowtype;
  requested_date date;
  slot_time time;
  total_day_count integer;
  zone_day_count integer;
  debt_now numeric;
  debt_limit numeric;
begin
  select * into s from public.settings where id = 1;
  if not found then
    raise exception 'Settings row is missing';
  end if;

  if new.tenant_id is null then
    new.tenant_id := auth.uid();
  end if;

  if new.tenant_id is null then
    raise exception 'Tenant is required';
  end if;

  if new.zone_id is null then
    select p.zone_id into new.zone_id from public.profiles p where p.id = new.tenant_id;
  end if;

  if new.zone_id is null then
    raise exception 'Tenant must be assigned to a zone';
  end if;

  new.slot_start := public.round_slot_30(new.requested_datetime);
  new.slot_end := new.slot_start + interval '30 minutes';
  requested_date := (new.requested_datetime at time zone 'utc')::date;
  slot_time := (new.slot_start at time zone 'utc')::time;

  if requested_date = current_date and coalesce(new.is_express, false) = false then
    raise exception 'Today booking requires express mode';
  end if;

  if requested_date <> current_date + 1 and not (requested_date = current_date and coalesce(new.is_express, false)) then
    raise exception 'Bookings are limited to tomorrow; today only allowed as express';
  end if;

  if s.break_start is not null and s.break_end is not null and slot_time >= s.break_start and slot_time < s.break_end then
    raise exception 'Booking is not allowed during break window';
  end if;

  if exists (
    select 1
    from public.closures c
    where c.is_active = true
      and (c.zone_id is null or c.zone_id = new.zone_id)
      and tstzrange(c.starts_at, c.ends_at, '[)') @> new.slot_start
  ) then
    raise exception 'Selected time is closed by force majeure closure';
  end if;

  if slot_time >= s.work_start and slot_time < s.work_end then
    if exists (
      select 1
      from public.bookings b
      where b.zone_id = new.zone_id
        and b.slot_start = new.slot_start
        and b.status not in ('rejected', 'cancelled')
    ) then
      raise exception 'Controlled window allows only one booking per 30-minute slot per zone';
    end if;
  end if;

  select count(*) into total_day_count
  from public.bookings b
  where b.tenant_id = new.tenant_id
    and (b.requested_datetime at time zone 'utc')::date = requested_date
    and b.status not in ('rejected', 'cancelled');

  if total_day_count >= 2 then
    raise exception 'Tenant reached max 2 bookings per day';
  end if;

  select count(*) into zone_day_count
  from public.bookings b
  where b.tenant_id = new.tenant_id
    and b.zone_id = new.zone_id
    and (b.requested_datetime at time zone 'utc')::date = requested_date
    and b.status not in ('rejected', 'cancelled');

  if zone_day_count >= 2 then
    raise exception 'Tenant reached max 2 bookings per day in this zone';
  end if;

  debt_now := public.tenant_debt(new.tenant_id);
  debt_limit := s.debt_block_hours * s.hourly_penalty;

  if debt_now > debt_limit then
    raise exception 'Booking blocked because debt exceeded configured threshold';
  end if;

  if coalesce(new.is_express, false) and requested_date = current_date then
    new.express_fee := s.hourly_penalty;
  else
    new.express_fee := 0;
  end if;

  new.status := coalesce(new.status, 'pending');
  new.created_at := coalesce(new.created_at, now());
  new.updated_at := now();

  return new;
end;
$$;

create or replace function public.booking_before_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.settings%rowtype;
  role_now text;
  zone_now uuid;
  booking_date date;
begin
  select * into s from public.settings where id = 1;
  role_now := public.app_role();
  zone_now := public.app_zone();
  booking_date := (old.requested_datetime at time zone 'utc')::date;

  new.updated_at := now();

  if new.status is distinct from old.status then
    if role_now = 'admin' then
      null;
    elsif role_now = 'tenant' then
      if old.tenant_id <> auth.uid() then
        raise exception 'Tenant can only update own bookings';
      end if;
      if not (old.status in ('pending', 'approved') and new.status = 'cancelled') then
        raise exception 'Tenant can only cancel pending/approved bookings';
      end if;
    elsif role_now = 'guard' then
      if zone_now is null or zone_now <> old.zone_id then
        raise exception 'Guard can only update bookings in selected zone';
      end if;
      if booking_date <> current_date then
        raise exception 'Guard can only update today bookings';
      end if;

      if old.status = 'approved' and new.status = 'arrived' then
        new.arrived_at := coalesce(new.arrived_at, now());
        new.logged_in := coalesce(new.logged_in, new.arrived_at);
      elsif old.status = 'arrived' and new.status = 'left' then
        new.left_at := coalesce(new.left_at, now());
        new.logged_out := coalesce(new.logged_out, new.left_at);
      elsif old.status = 'left' and new.status = 'completed' then
        new.completed_at := coalesce(new.completed_at, now());
      else
        raise exception 'Invalid guard status transition';
      end if;
    else
      raise exception 'Unauthorized role for booking update';
    end if;
  end if;

  if new.status in ('left', 'completed') then
    if new.logged_out is null then
      new.logged_out := coalesce(new.left_at, now());
    end if;
    if new.left_at is null then
      new.left_at := new.logged_out;
    end if;

    new.overtime_minutes := greatest(
      0,
      ceil(extract(epoch from (new.logged_out - old.slot_end)) / 60.0)::int
    );

    new.penalty_amount := round(((s.hourly_penalty / 60.0) * new.overtime_minutes)::numeric, 2);
  end if;

  return new;
end;
$$;

create or replace function public.log_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  payload_old jsonb;
  payload_new jsonb;
  rec_id text;
begin
  if tg_op = 'INSERT' then
    payload_old := null;
    payload_new := to_jsonb(new);
    rec_id := payload_new ->> 'id';
  elsif tg_op = 'UPDATE' then
    payload_old := to_jsonb(old);
    payload_new := to_jsonb(new);
    rec_id := coalesce(payload_new ->> 'id', payload_old ->> 'id');
  else
    payload_old := to_jsonb(old);
    payload_new := null;
    rec_id := payload_old ->> 'id';
  end if;

  insert into public.audit_logs (table_name, record_id, action, old_data, new_data, actor_id)
  values (tg_table_name, rec_id, tg_op, payload_old, payload_new, auth.uid());

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create or replace trigger trg_zones_updated_at
before update on public.zones
for each row
execute function public.set_updated_at();

create or replace trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace trigger trg_settings_updated_at
before update on public.settings
for each row
execute function public.set_updated_at();

create or replace trigger trg_closures_updated_at
before update on public.closures
for each row
execute function public.set_updated_at();

drop trigger if exists trg_booking_before_insert on public.bookings;
create trigger trg_booking_before_insert
before insert on public.bookings
for each row
execute function public.booking_before_insert();

drop trigger if exists trg_booking_before_update on public.bookings;
create trigger trg_booking_before_update
before update on public.bookings
for each row
execute function public.booking_before_update();

drop trigger if exists trg_audit_bookings on public.bookings;
create trigger trg_audit_bookings
after insert or update or delete on public.bookings
for each row
execute function public.log_audit();

drop trigger if exists trg_audit_zones on public.zones;
create trigger trg_audit_zones
after insert or update or delete on public.zones
for each row
execute function public.log_audit();

drop trigger if exists trg_audit_profiles on public.profiles;
create trigger trg_audit_profiles
after insert or update or delete on public.profiles
for each row
execute function public.log_audit();

drop trigger if exists trg_audit_settings on public.settings;
create trigger trg_audit_settings
after insert or update or delete on public.settings
for each row
execute function public.log_audit();

drop trigger if exists trg_audit_notifications on public.notifications;
create trigger trg_audit_notifications
after insert or update or delete on public.notifications
for each row
execute function public.log_audit();

drop trigger if exists trg_audit_closures on public.closures;
create trigger trg_audit_closures
after insert or update or delete on public.closures
for each row
execute function public.log_audit();

alter table public.zones enable row level security;
alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.closures enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_reads enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists zones_select_authenticated on public.zones;
create policy zones_select_authenticated on public.zones
for select to authenticated
using (true);

drop policy if exists zones_admin_manage on public.zones;
create policy zones_admin_manage on public.zones
for all to authenticated
using (public.app_role() = 'admin')
with check (public.app_role() = 'admin');

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
for select to authenticated
using (
  public.app_role() = 'admin'
  or id = auth.uid()
  or role = 'tenant'
);

drop policy if exists profiles_insert_admin on public.profiles;
create policy profiles_insert_admin on public.profiles
for insert to authenticated
with check (public.app_role() = 'admin');

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
for update to authenticated
using (public.app_role() = 'admin' or id = auth.uid())
with check (public.app_role() = 'admin' or id = auth.uid());

drop policy if exists profiles_delete_admin on public.profiles;
create policy profiles_delete_admin on public.profiles
for delete to authenticated
using (public.app_role() = 'admin');

drop policy if exists settings_select on public.settings;
create policy settings_select on public.settings
for select to authenticated
using (true);

drop policy if exists settings_admin_manage on public.settings;
create policy settings_admin_manage on public.settings
for all to authenticated
using (public.app_role() = 'admin')
with check (public.app_role() = 'admin');

drop policy if exists closures_select on public.closures;
create policy closures_select on public.closures
for select to authenticated
using (true);

drop policy if exists closures_admin_manage on public.closures;
create policy closures_admin_manage on public.closures
for all to authenticated
using (public.app_role() = 'admin')
with check (public.app_role() = 'admin');

drop policy if exists bookings_select on public.bookings;
create policy bookings_select on public.bookings
for select to authenticated
using (
  public.app_role() = 'admin'
  or (public.app_role() = 'tenant' and zone_id = public.app_zone())
  or (
    public.app_role() = 'guard'
    and zone_id = public.app_zone()
    and (requested_datetime at time zone 'utc')::date = current_date
  )
);

drop policy if exists bookings_insert_tenant on public.bookings;
create policy bookings_insert_tenant on public.bookings
for insert to authenticated
with check (
  public.app_role() = 'tenant'
  and tenant_id = auth.uid()
  and zone_id = public.app_zone()
);

drop policy if exists bookings_update_roles on public.bookings;
create policy bookings_update_roles on public.bookings
for update to authenticated
using (
  public.app_role() = 'admin'
  or (public.app_role() = 'tenant' and tenant_id = auth.uid())
  or (
    public.app_role() = 'guard'
    and zone_id = public.app_zone()
    and (requested_datetime at time zone 'utc')::date = current_date
  )
)
with check (
  public.app_role() = 'admin'
  or (public.app_role() = 'tenant' and tenant_id = auth.uid())
  or (
    public.app_role() = 'guard'
    and zone_id = public.app_zone()
    and (requested_datetime at time zone 'utc')::date = current_date
  )
);

drop policy if exists bookings_delete_admin on public.bookings;
create policy bookings_delete_admin on public.bookings
for delete to authenticated
using (public.app_role() = 'admin');

drop policy if exists payments_select on public.payments;
create policy payments_select on public.payments
for select to authenticated
using (public.app_role() = 'admin' or tenant_id = auth.uid());

drop policy if exists payments_admin_manage on public.payments;
create policy payments_admin_manage on public.payments
for all to authenticated
using (public.app_role() = 'admin')
with check (public.app_role() = 'admin');

drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications
for select to authenticated
using (
  public.app_role() = 'admin'
  or recipient_id is null
  or recipient_id = auth.uid()
);

drop policy if exists notifications_insert_admin on public.notifications;
create policy notifications_insert_admin on public.notifications
for insert to authenticated
with check (
  public.app_role() = 'admin'
  and coalesce(created_by, auth.uid()) = auth.uid()
);

drop policy if exists notifications_update_admin on public.notifications;
create policy notifications_update_admin on public.notifications
for update to authenticated
using (public.app_role() = 'admin')
with check (public.app_role() = 'admin');

drop policy if exists notifications_delete_admin on public.notifications;
create policy notifications_delete_admin on public.notifications
for delete to authenticated
using (public.app_role() = 'admin');

drop policy if exists notification_reads_select on public.notification_reads;
create policy notification_reads_select on public.notification_reads
for select to authenticated
using (public.app_role() = 'admin' or user_id = auth.uid());

drop policy if exists notification_reads_insert on public.notification_reads;
create policy notification_reads_insert on public.notification_reads
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists notification_reads_update on public.notification_reads;
create policy notification_reads_update on public.notification_reads
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists notification_reads_delete on public.notification_reads;
create policy notification_reads_delete on public.notification_reads
for delete to authenticated
using (public.app_role() = 'admin' or user_id = auth.uid());

drop policy if exists audit_logs_admin_read on public.audit_logs;
create policy audit_logs_admin_read on public.audit_logs
for select to authenticated
using (public.app_role() = 'admin');

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('templates', 'templates', false)
on conflict (id) do nothing;

drop policy if exists documents_select on storage.objects;
create policy documents_select on storage.objects
for select to authenticated
using (
  bucket_id = 'documents'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.app_role() in ('admin', 'guard')
  )
);

drop policy if exists documents_insert on storage.objects;
create policy documents_insert on storage.objects
for insert to authenticated
with check (
  bucket_id = 'documents'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists documents_update on storage.objects;
create policy documents_update on storage.objects
for update to authenticated
using (
  bucket_id = 'documents'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.app_role() = 'admin'
  )
)
with check (
  bucket_id = 'documents'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.app_role() = 'admin'
  )
);

drop policy if exists documents_delete on storage.objects;
create policy documents_delete on storage.objects
for delete to authenticated
using (
  bucket_id = 'documents'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.app_role() = 'admin'
  )
);

drop policy if exists templates_select on storage.objects;
create policy templates_select on storage.objects
for select to authenticated
using (bucket_id = 'templates');

drop policy if exists templates_insert_admin on storage.objects;
create policy templates_insert_admin on storage.objects
for insert to authenticated
with check (bucket_id = 'templates' and public.app_role() = 'admin');

drop policy if exists templates_update_admin on storage.objects;
create policy templates_update_admin on storage.objects
for update to authenticated
using (bucket_id = 'templates' and public.app_role() = 'admin')
with check (bucket_id = 'templates' and public.app_role() = 'admin');

drop policy if exists templates_delete_admin on storage.objects;
create policy templates_delete_admin on storage.objects
for delete to authenticated
using (bucket_id = 'templates' and public.app_role() = 'admin');
