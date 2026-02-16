<script setup lang="ts">
import type { Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const selectedZone = useState<string | null>('guard-zone', () => null)
const { bookingStatusLabel } = useRuLabels()

const rows = ref<any[]>([])
const zoneName = ref('')

const todayStart = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

const todayEnd = () => {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.toISOString()
}

const load = async () => {
  if (!selectedZone.value) {
    await navigateTo('/guard')
    return
  }

  const [zoneResp, bookingsResp] = await Promise.all([
    supabase.from('zones').select('name').eq('id', selectedZone.value).single(),
    supabase
      .from('bookings')
      .select('*')
      .eq('zone_id', selectedZone.value)
      .gte('requested_datetime', todayStart())
      .lte('requested_datetime', todayEnd())
      .in('status', ['approved', 'arrived', 'left', 'completed'])
      .order('requested_datetime')
  ])

  zoneName.value = zoneResp.data?.name || ''
  rows.value = bookingsResp.data ?? []
}

const updateStatus = async (row: any, status: 'arrived' | 'left' | 'completed') => {
  const { error } = await supabase.from('bookings').update({ status }).eq('id', row.id)
  if (!error) {
    await load()
  }
}

onMounted(load)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Бронирования на сегодня</h1>
        <p class="text-sm text-slate-500">Зона: {{ zoneName || 'Не выбрана' }}</p>
      </div>
      <UButton label="Сменить зону" variant="outline" @click="navigateTo('/guard')" />
    </div>

    <UCard>
      <UTable
        :rows="rows"
        :columns="[
          { key: 'requested_datetime', label: 'Слот' },
          { key: 'driver_name', label: 'Водитель' },
          { key: 'car_plate_text', label: 'Номер' },
          { key: 'status', label: 'Статус' },
          { key: 'overtime_minutes', label: 'Переработка (мин)' },
          { key: 'actions', label: 'Действия' }
        ]"
      >
        <template #requested_datetime-data="{ row }">{{ new Date(row.requested_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</template>
        <template #status-data="{ row }">{{ bookingStatusLabel(row.status) }}</template>
        <template #actions-data="{ row }">
          <div class="flex gap-1">
            <UButton size="2xs" label="Прибыл" :disabled="row.status !== 'approved'" @click="updateStatus(row, 'arrived')" />
            <UButton size="2xs" label="Выехал" :disabled="row.status !== 'arrived'" @click="updateStatus(row, 'left')" />
            <UButton size="2xs" label="Завершено" :disabled="row.status !== 'left'" @click="updateStatus(row, 'completed')" />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
