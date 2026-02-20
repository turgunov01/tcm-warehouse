<script setup lang="ts">
const props = defineProps<{
  label: string
  value: number
  tone?: 'default' | 'success' | 'warning' | 'danger'
}>()

const valueEl = ref<HTMLElement | null>(null)
const { animateCount, animateIn } = useGsap()

const toneClass = computed(() => {
  if (props.tone === 'success') return 'text-emerald-300'
  if (props.tone === 'warning') return 'text-amber-300'
  if (props.tone === 'danger') return 'text-rose-300'
  return 'text-slate-100'
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
  <UCard class="stat-card kinetic-card">
    <p class="text-xs uppercase tracking-wide text-slate-400">{{ label }}</p>
    <p ref="valueEl" class="mt-2 text-3xl font-semibold" :class="toneClass">0</p>
  </UCard>
</template>
