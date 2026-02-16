<script setup lang="ts">
import type { BookingStatus } from '~/types/database'

const props = defineProps<{
  modelValue: {
    from: string
    to: string
    statuses: BookingStatus[]
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { from: string; to: string; statuses: BookingStatus[] }): void
}>()

const state = ref({ ...props.modelValue })
const { bookingStatusLabel } = useRuLabels()

watch(
  () => props.modelValue,
  (next) => {
    state.value = { ...next }
  }
)

watch(
  state,
  (next) => {
    emit('update:modelValue', next)
  },
  { deep: true }
)

const statusOptions = ([
  'pending',
  'approved',
  'rejected',
  'cancelled',
  'arrived',
  'left',
  'completed'
] as BookingStatus[]).map((value) => ({
  value,
  label: bookingStatusLabel(value)
}))
</script>

<template>
  <UCard>
    <div class="grid gap-3 md:grid-cols-3">
      <UFormGroup label="С">
        <UInput v-model="state.from" type="date" />
      </UFormGroup>
      <UFormGroup label="По">
        <UInput v-model="state.to" type="date" />
      </UFormGroup>
      <UFormGroup label="Статусы">
        <USelectMenu
          v-model="state.statuses"
          :options="statusOptions"
          option-attribute="label"
          value-attribute="value"
          multiple
          searchable
        />
      </UFormGroup>
    </div>
  </UCard>
</template>
