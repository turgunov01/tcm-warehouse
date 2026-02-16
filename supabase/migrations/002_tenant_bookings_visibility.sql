drop policy if exists bookings_select on public.bookings;

create policy bookings_select on public.bookings
for select to authenticated
using (
  public.app_role() = 'admin'
  or (public.app_role() = 'tenant' and tenant_id = auth.uid())
  or (
    public.app_role() = 'guard'
    and zone_id = public.app_zone()
    and (requested_datetime at time zone 'utc')::date = current_date
  )
);
