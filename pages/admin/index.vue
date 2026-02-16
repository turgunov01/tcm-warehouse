<script setup lang="ts">
import type { BookingStatus, Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const { fetchBookings, fetchRecentActivity } = useWarehouse()
const { bookingStatusLabel } = useRuLabels()

const loading = ref(true)
const viewMode = ref<'table' | 'calendar'>('table')
const filters = ref({
  from: '',
  to: '',
  statuses: [] as BookingStatus[]
})

const bookings = ref<any[]>([])
const tenants = ref<Array<{ id: string; full_name: string | null }>>([])
const selectedTenants = ref<string[]>([])
const activity = ref<any[]>([])

const statusCounts = computed(() => {
  const map: Record<string, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0
  }

  for (const row of bookings.value) {
    if (map[row.status] !== undefined) {
      map[row.status] += 1
    }
  }

  return map
})

const pieLabels = computed(() => Object.keys(statusCounts.value).map((status) => bookingStatusLabel(status)))
const pieValues = computed(() => Object.values(statusCounts.value))

const filteredBookings = computed(() => {
  if (!selectedTenants.value.length) {
    return bookings.value
  }
  return bookings.value.filter((row) => selectedTenants.value.includes(row.tenant_id))
})

const refresh = async () => {
  loading.value = true
  bookings.value = await fetchBookings({
    from: filters.value.from ? `${filters.value.from}T00:00:00` : undefined,
    to: filters.value.to ? `${filters.value.to}T23:59:59` : undefined,
    statuses: filters.value.statuses
  })
  activity.value = await fetchRecentActivity(5)
  loading.value = false
}

onMounted(async () => {
  const { data } = await supabase.from('profiles').select('id, full_name').eq('role', 'tenant').order('full_name')
  tenants.value = data ?? []
  await refresh()
})

watch(filters, refresh, { deep: true })
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold">Панель администратора</h1>
      <p class="text-sm text-slate-500">Обзор склада, бронирований и активности.</p>
    </div>

    <div class="card-grid">
      <DashboardStatCard label="В ожидании" :value="statusCounts.pending" tone="warning" />
      <DashboardStatCard label="Одобрено" :value="statusCounts.approved" tone="success" />
      <DashboardStatCard label="Отклонено" :value="statusCounts.rejected" tone="danger" />
      <DashboardStatCard label="Завершено" :value="statusCounts.completed" />
    </div>

    <div class="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <StatusPieChart title="Распределение статусов" :labels="pieLabels" :values="pieValues" />
      <ActivityFeed :items="activity" show-more-to="/admin/audit" />
    </div>

    <div class="grid gap-4">
      <BookingFilters v-model="filters" />

      <UCard>
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <UFormGroup label="Фильтр по арендатору" class="w-full md:max-w-md">
            <USelectMenu
              v-model="selectedTenants"
              :options="tenants"
              option-attribute="full_name"
              value-attribute="id"
              multiple
              searchable
            />
          </UFormGroup>

          <UButtonGroup>
            <UButton label="Таблица" :variant="viewMode === 'table' ? 'solid' : 'outline'" @click="viewMode = 'table'" />
            <UButton label="Календарь" :variant="viewMode === 'calendar' ? 'solid' : 'outline'" @click="viewMode = 'calendar'" />
          </UButtonGroup>
        </div>
      </UCard>

      <div v-if="loading">
        <USkeleton class="h-44" />
      </div>
      <BookingTable v-else-if="viewMode === 'table'" :rows="filteredBookings" />
      <BookingCalendar v-else :rows="filteredBookings" />
    </div>
  </div>
</template>

