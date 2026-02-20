<script setup lang="ts">
const { user } = useAuthRbac()
const { fetchBookings, fetchTenantDebt } = useWarehouse()
const { bookingStatusLabel } = useRuLabels()

const bookings = ref<any[]>([])
const debt = ref(0)

const lastBookings = computed(() => bookings.value.slice(0, 6))
const totalOvertimeMinutes = computed(() =>
  bookings.value.reduce((sum, booking) => sum + Number(booking.overtime_minutes || 0), 0)
)
const statusMap = computed(() => {
  const map: Record<string, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0
  }
  for (const b of bookings.value) {
    if (map[b.status] !== undefined) map[b.status] += 1
  }
  return map
})

const load = async () => {
  const tenantId = user.value?.id
  if (!tenantId) {
    bookings.value = []
    debt.value = 0
    return
  }

  bookings.value = await fetchBookings({ tenantIds: [tenantId] })
  debt.value = await fetchTenantDebt(tenantId)
}

onMounted(load)

watch(
  () => user.value?.id,
  () => {
    load()
  }
)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold">Панель арендатора</h1>
      <p class="text-sm text-slate-500">Сводка бронирований и текущая задолженность.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <DashboardStatCard label="Общий долг" :value="debt" tone="danger" />
      <DashboardStatCard label="В ожидании" :value="statusMap.pending" tone="warning" />
      <DashboardStatCard label="Одобрено" :value="statusMap.approved" tone="success" />
      <DashboardStatCard label="Завершено" :value="statusMap.completed" />
      <DashboardStatCard label="Опоздание (мин)" :value="totalOvertimeMinutes" tone="warning" />
    </div>

    <div class="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <StatusPieChart :title="'Мои статусы'" :labels="Object.keys(statusMap).map((x) => bookingStatusLabel(x))" :values="Object.values(statusMap)" />
      <UCard>
        <template #header><p class="font-semibold">Последние бронирования</p></template>
        <div class="space-y-2">
          <div v-for="booking in lastBookings" :key="booking.id" class="rounded border border-[#eeeeee] p-3">
            <p class="text-sm font-medium">{{ new Date(booking.requested_datetime).toLocaleString() }}</p>
            <p class="text-sm text-slate-600">{{ booking.driver_name }} • {{ booking.car_plate_text }}</p>
            <UBadge class="mt-2" :label="bookingStatusLabel(booking.status)" color="gray" variant="subtle" />
          </div>
          <p v-if="!lastBookings.length" class="text-sm text-slate-500">Пока нет бронирований.</p>
        </div>
      </UCard>
    </div>
  </div>
</template>
