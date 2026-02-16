<script setup lang="ts">
const { actionLabel, tableLabel } = useRuLabels()

const feed = ref<HTMLElement | null>(null)
const props = withDefaults(defineProps<{
  items: Array<{
    id: string
    action: string
    table_name: string
    created_at: string
  }>
  showMoreTo?: string
  showMoreLabel?: string
}>(), {
  showMoreTo: '',
  showMoreLabel: 'Показать еще'
})

const { staggerList } = useGsap()

onMounted(async () => {
  if (feed.value) {
    await staggerList(feed.value, '.activity-item', { stagger: 0.07, duration: 0.25 })
  }
})
</script>

<template>
  <UCard>
    <template #header>
      <p class="font-semibold">Последняя активность</p>
    </template>
    <div ref="feed" class="space-y-2">
      <div
        v-for="item in props.items"
        :key="item.id"
        class="activity-item rounded border border-[#eeeeee] p-3"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm text-slate-900">{{ actionLabel(item.action) }}: {{ tableLabel(item.table_name) }}</p>
          <p class="text-xs text-slate-500">{{ new Date(item.created_at).toLocaleString() }}</p>
        </div>
      </div>
      <p v-if="!props.items.length" class="text-sm text-slate-500">Пока нет активности.</p>
    </div>
    <div v-if="props.showMoreTo" class="mt-3 flex justify-end">
      <UButton size="xs" variant="outline" color="white" :label="props.showMoreLabel" :to="props.showMoreTo" />
    </div>
  </UCard>
</template>
