<script setup lang="ts">
const props = defineProps<{
  rows: Record<string, any>[]
}>()
const { bookingStatusLabel } = useRuLabels()

const grouped = computed(() => {
  const map = new Map<string, Record<string, any>[]>()
  for (const row of props.rows) {
    const day = new Date(row.requested_datetime).toISOString().slice(0, 10)
    const arr = map.get(day) || []
    arr.push(row)
    map.set(day, arr)
  }
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
})
</script>

<template>
  <UCard>
    <template #header>
      <p class="font-semibold">Календарь</p>
    </template>
    <div class="space-y-4">
      <div v-for="item in grouped" :key="item[0]" class="rounded border border-[#eeeeee] p-3">
        <p class="mb-2 font-medium">{{ item[0] }}</p>
        <div class="space-y-2">
          <div v-for="booking in item[1]" :key="booking.id" class="flex items-center justify-between rounded-md border border-[#eeeeee] bg-transparent p-2">
            <span class="text-sm">{{ new Date(booking.requested_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }} - {{ booking.driver_name }}</span>
            <UBadge :label="bookingStatusLabel(booking.status)" color="gray" variant="subtle" />
          </div>
        </div>
      </div>
      <p v-if="!grouped.length" class="text-sm text-slate-500">Записей в календаре нет.</p>
    </div>
  </UCard>
</template>
