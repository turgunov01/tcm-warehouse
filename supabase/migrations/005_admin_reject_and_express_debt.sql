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
  select coalesce(
    sum(
      case
        when b.is_express then b.penalty_amount + b.express_fee
        else 0
      end
    ),
    0
  )
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

create or replace function public.prevent_admin_reject_approved_booking()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.status = 'approved'
     and new.status = 'rejected'
     and public.app_role() = 'admin' then
    raise exception 'Approved booking cannot be rejected by admin';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_admin_reject_approved_booking on public.bookings;

create trigger trg_prevent_admin_reject_approved_booking
before update on public.bookings
for each row
execute function public.prevent_admin_reject_approved_booking();
