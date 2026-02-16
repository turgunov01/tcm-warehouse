<script setup lang="ts">
import type { Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const { actionLabel, tableLabel } = useRuLabels()

const rows = ref<Database['public']['Tables']['audit_logs']['Row'][]>([])
const tableFilter = ref('')
const actionFilter = ref('')

const load = async () => {
  let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(300)
  if (tableFilter.value) {
    query = query.eq('table_name', tableFilter.value)
  }
  if (actionFilter.value) {
    query = query.eq('action', actionFilter.value)
  }
  const { data } = await query
  rows.value = data ?? []
}

onMounted(load)
watch([tableFilter, actionFilter], load)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold">Журнал аудита</h1>
      <p class="text-sm text-slate-500">Отслеживание изменений в ключевых таблицах.</p>
    </div>

    <UCard>
      <div class="grid gap-3 md:grid-cols-3">
        <UFormGroup label="Таблица">
          <UInput v-model="tableFilter" placeholder="bookings" />
        </UFormGroup>
        <UFormGroup label="Действие">
          <USelectMenu v-model="actionFilter" :options="['', 'INSERT', 'UPDATE', 'DELETE']" />
        </UFormGroup>
        <div class="flex items-end">
          <UButton label="Обновить" @click="load" />
        </div>
      </div>
    </UCard>

    <UCard>
      <UTable
        :rows="rows"
        :columns="[
          { key: 'created_at', label: 'Время' },
          { key: 'table_name', label: 'Таблица' },
          { key: 'action', label: 'Действие' },
          { key: 'record_id', label: 'Запись' },
          { key: 'actor_id', label: 'Кто изменил' }
        ]"
      >
        <template #created_at-data="{ row }">{{ new Date(row.created_at).toLocaleString() }}</template>
        <template #table_name-data="{ row }">{{ tableLabel(row.table_name) }}</template>
        <template #action-data="{ row }">{{ actionLabel(row.action) }}</template>
      </UTable>
    </UCard>
  </div>
</template>
