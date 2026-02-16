<script setup lang="ts">
const { fetchNotifications, markNotificationRead } = useWarehouse()

const rows = ref<any[]>([])

const load = async () => {
  rows.value = await fetchNotifications()
}

const isRead = (row: any) => {
  return row.notification_reads?.length > 0
}

const markRead = async (row: any) => {
  await markNotificationRead(row.id)
  await load()
}

onMounted(load)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold">Уведомления</h1>
      <p class="text-sm text-slate-500">Общие и персональные сообщения.</p>
    </div>

    <div class="space-y-3">
      <UCard v-for="row in rows" :key="row.id">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1">
            <p class="font-semibold">{{ row.title }}</p>
            <p class="text-sm text-slate-700">{{ row.body }}</p>
            <p class="text-xs text-slate-500">{{ new Date(row.created_at).toLocaleString() }}</p>
          </div>
          <UButton
            size="xs"
            :variant="isRead(row) ? 'ghost' : 'solid'"
            :label="isRead(row) ? 'Прочитано' : 'Отметить прочитанным'"
            @click="markRead(row)"
          />
        </div>
      </UCard>
      <p v-if="!rows.length" class="text-sm text-slate-500">Пока нет уведомлений.</p>
    </div>
  </div>
</template>
