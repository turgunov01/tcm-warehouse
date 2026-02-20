alter table public.bookings
add column if not exists car_fuel_type text;

alter table public.bookings
add column if not exists operation_type text;

update public.bookings
set car_fuel_type = 'petrol'
where car_fuel_type is null;

update public.bookings
set operation_type = 'inbound'
where operation_type is null;

alter table public.bookings
alter column car_fuel_type set not null;

alter table public.bookings
alter column operation_type set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_car_fuel_type_check'
  ) then
    alter table public.bookings
      add constraint bookings_car_fuel_type_check
      check (car_fuel_type in ('gas', 'petrol'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_operation_type_check'
  ) then
    alter table public.bookings
      add constraint bookings_operation_type_check
      check (operation_type in ('inbound', 'outbound', 'inbound_outbound'));
  end if;
end $$;
