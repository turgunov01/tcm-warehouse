<script setup lang="ts">
import type { Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()

const zones = ref<Database['public']['Tables']['zones']['Row'][]>([])
const form = reactive({ name: '', description: '' })
const editing = ref<string | null>(null)

const loadZones = async () => {
  const { data } = await supabase.from('zones').select('*').order('created_at')
  zones.value = data ?? []
}

const saveZone = async () => {
  if (!form.name.trim()) {
    return
  }

  if (editing.value) {
    await supabase.from('zones').update({ name: form.name, description: form.description || null }).eq('id', editing.value)
  } else {
    await supabase.from('zones').insert({ name: form.name, description: form.description || null })
  }

  form.name = ''
  form.description = ''
  editing.value = null
  await loadZones()
}

const editRow = (row: Database['public']['Tables']['zones']['Row']) => {
  editing.value = row.id
  form.name = row.name
  form.description = row.description || ''
}

const deleteZone = async (id: string) => {
  await supabase.from('zones').delete().eq('id', id)
  await loadZones()
}

onMounted(loadZones)
</script>

<template>
  <div class="space-y-4 admin-page-content">
    <div>
      <h1 class="text-2xl font-semibold">Зоны</h1>
      <p class="text-sm text-slate-500">Создание и управление зонами склада.</p>
    </div>

    <UCard>
      <UForm :state="form" class="grid gap-3 md:grid-cols-[2fr_3fr_auto]" @submit.prevent="saveZone">
        <UFormGroup label="Название зоны">
          <UInput v-model="form.name" placeholder="Зона 1" required />
        </UFormGroup>
        <UFormGroup label="Описание">
          <UInput v-model="form.description" placeholder="Необязательное примечание" />
        </UFormGroup>
        <div class="flex items-end">
          <UButton type="submit" color="white" :label="editing ? 'Обновить' : 'Создать'" />
        </div>
      </UForm>
    </UCard>

    <UCard>
      <UTable :rows="zones" :columns="[
        { key: 'name', label: 'Название' },
        { key: 'description', label: 'Описание' },
        { key: 'actions', label: 'Действия' }
      ]">
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" label="Изменить" @click="editRow(row)" />
            <UButton size="xs" color="red" variant="outline" label="Удалить" @click="deleteZone(row.id)" />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
