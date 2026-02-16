<script setup lang="ts">
import type { BookingStatus, Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const { fetchBookings } = useWarehouse()
const { bookingStatusLabel } = useRuLabels()

const loading = ref(false)
const rows = ref<any[]>([])
const notice = ref('')
const filters = ref({
  from: '',
  to: '',
  statuses: [] as BookingStatus[]
})

const approvingId = ref<string | null>(null)
const removingId = ref<string | null>(null)

const tableColumns = [
  { key: 'requested_datetime', label: 'Запрошено' },
  { key: 'status', label: 'Статус' },
  { key: 'driver_name', label: 'Водитель' },
  { key: 'car_plate_text', label: 'Номер' },
  { key: 'tenant', label: 'Арендатор' },
  { key: 'zone_id', label: 'Зона' },
  { key: 'actions', label: 'Действия' }
]

const refresh = async () => {
  loading.value = true
  rows.value = await fetchBookings({
    from: filters.value.from ? `${filters.value.from}T00:00:00` : undefined,
    to: filters.value.to ? `${filters.value.to}T23:59:59` : undefined,
    statuses: filters.value.statuses
  })
  loading.value = false
}

const approveBooking = async (row: any) => {
  approvingId.value = row.id
  const { error } = await supabase.from('bookings').update({ status: 'approved' }).eq('id', row.id)
  notice.value = error ? error.message : 'Бронирование одобрено.'
  approvingId.value = null
  await refresh()
}

const removeBooking = async (row: any) => {
  const ok = confirm('Удалить это бронирование? Действие нельзя отменить.')
  if (!ok) {
    return
  }

  removingId.value = row.id
  const { error } = await supabase.from('bookings').delete().eq('id', row.id)
  notice.value = error ? error.message : 'Бронирование удалено.'
  removingId.value = null
  await refresh()
}

onMounted(refresh)
watch(filters, refresh, { deep: true })
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold">Бронирования</h1>
      <p class="text-sm text-slate-500">Одобрение и удаление заявок арендаторов.</p>
    </div>

    <UAlert v-if="notice" :title="notice" color="primary" variant="subtle" />

    <BookingFilters v-model="filters" />

    <UCard>
      <div v-if="loading">
        <USkeleton class="h-40" />
      </div>
      <UTable
        v-else
        :rows="rows"
        :columns="tableColumns"
      >
        <template #requested_datetime-data="{ row }">
          {{ new Date(row.requested_datetime).toLocaleString() }}
        </template>
        <template #status-data="{ row }">
          <UBadge :label="bookingStatusLabel(row.status)" color="gray" variant="subtle" />
        </template>
        <template #tenant-data="{ row }">
          {{ row.profiles?.full_name || row.tenant_id }}
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton
              size="xs"
              label="Одобрить"
              :loading="approvingId === row.id"
              :disabled="row.status === 'approved' || removingId === row.id"
              @click="approveBooking(row)"
            />
            <UButton
              size="xs"
              label="Удалить"
              color="red"
              variant="outline"
              :loading="removingId === row.id"
              :disabled="approvingId === row.id"
              @click="removeBooking(row)"
            />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
