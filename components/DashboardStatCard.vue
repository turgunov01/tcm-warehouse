<script setup lang="ts">
const props = defineProps<{
  label: string
  value: number
  tone?: 'default' | 'success' | 'warning' | 'danger'
}>()

const valueEl = ref<HTMLElement | null>(null)
const { animateCount, animateIn } = useGsap()

const toneClass = computed(() => {
  if (props.tone === 'success') return 'text-emerald-600'
  if (props.tone === 'warning') return 'text-amber-600'
  if (props.tone === 'danger') return 'text-rose-600'
  return 'text-slate-900'
})

watch(
  () => props.value,
  async (next, prev) => {
    if (!valueEl.value) {
      return
    }
    await animateCount(valueEl.value, prev ?? 0, next, 0.8)
  },
  { immediate: true }
)

onMounted(async () => {
  if (valueEl.value) {
    await animateIn(valueEl.value.closest('.stat-card') as HTMLElement)
  }
})
</script>

<template>
  <UCard class="stat-card">
    <p class="text-xs uppercase tracking-wide text-slate-500">{{ label }}</p>
    <p ref="valueEl" class="mt-2 text-3xl font-semibold" :class="toneClass">0</p>
  </UCard>
</template>
