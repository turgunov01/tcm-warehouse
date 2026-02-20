<script setup lang="ts">
const props = defineProps<{
  rows: Record<string, any>[]
}>()
const { bookingStatusLabel } = useRuLabels()

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'requested_datetime', label: 'Запрошено' },
  { key: 'status', label: 'Статус' },
  { key: 'driver_name', label: 'Водитель' },
  { key: 'car_plate_text', label: 'Номер' },
  { key: 'tenant', label: 'Арендатор' }
]
</script>

<template>
  <UCard class="kinetic-panel kinetic-panel-delay-c">
    <UTable class="table-kinetic" :rows="props.rows" :columns="columns">
      <template #status-data="{ row }">
        <UBadge :label="bookingStatusLabel(row.status)" color="gray" variant="subtle" />
      </template>
      <template #requested_datetime-data="{ row }">
        {{ new Date(row.requested_datetime).toLocaleString() }}
      </template>
      <template #tenant-data="{ row }">
        {{ row.profiles?.full_name || row.tenant_id }}
      </template>
    </UTable>
  </UCard>
</template>
