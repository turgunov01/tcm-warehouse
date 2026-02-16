<script setup lang="ts">
import type { Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const { getFirstFile } = useFileInput()

type SettingsForm = Omit<Database['public']['Tables']['settings']['Row'], 'break_start' | 'break_end'> & {
  break_start: string
  break_end: string
}

const settings = ref<SettingsForm | null>(null)
const closures = ref<Database['public']['Tables']['closures']['Row'][]>([])
const zones = ref<Database['public']['Tables']['zones']['Row'][]>([])
const notice = ref('')

const closureForm = reactive({
  zone_id: '',
  starts_at: '',
  ends_at: '',
  reason: ''
})

const templateFile = ref<File | null>(null)

const load = async () => {
  const [settingsResp, closuresResp, zonesResp] = await Promise.all([
    supabase.from('settings').select('*').eq('id', 1).single(),
    supabase.from('closures').select('*').order('starts_at', { ascending: false }),
    supabase.from('zones').select('*').order('name')
  ])

  settings.value = settingsResp.data
    ? {
        ...settingsResp.data,
        break_start: settingsResp.data.break_start || '',
        break_end: settingsResp.data.break_end || ''
      }
    : null
  closures.value = closuresResp.data ?? []
  zones.value = zonesResp.data ?? []
}

const saveSettings = async () => {
  if (!settings.value) {
    return
  }

  const { error } = await supabase.from('settings').update({
    free_start: settings.value.free_start,
    free_end: settings.value.free_end,
    work_start: settings.value.work_start,
    work_end: settings.value.work_end,
    break_start: settings.value.break_start || null,
    break_end: settings.value.break_end || null,
    hourly_penalty: settings.value.hourly_penalty,
    debt_block_hours: settings.value.debt_block_hours
  }).eq('id', 1)

  notice.value = error ? error.message : 'Настройки сохранены.'
  await load()
}

const createClosure = async () => {
  const { error } = await supabase.from('closures').insert({
    zone_id: closureForm.zone_id || null,
    starts_at: closureForm.starts_at,
    ends_at: closureForm.ends_at,
    reason: closureForm.reason
  })

  notice.value = error ? error.message : 'Ограничение добавлено.'
  closureForm.zone_id = ''
  closureForm.starts_at = ''
  closureForm.ends_at = ''
  closureForm.reason = ''
  await load()
}

const toggleClosure = async (row: Database['public']['Tables']['closures']['Row']) => {
  await supabase.from('closures').update({ is_active: !row.is_active }).eq('id', row.id)
  await load()
}

const uploadTemplate = async () => {
  if (!templateFile.value) {
    return
  }

  const name = `${Date.now()}-${templateFile.value.name}`
  const { error } = await supabase.storage.from('templates').upload(name, templateFile.value, { upsert: true })
  notice.value = error ? error.message : 'Шаблон загружен в хранилище templates.'
}

onMounted(load)
</script>

<template>
  <div class="space-y-4 admin-page-content">
    <div>
      <h1 class="text-2xl font-semibold">Настройки</h1>
      <p class="text-sm text-slate-500">Временные окна, ограничения, штрафы и лимиты долга.</p>
    </div>

    <UAlert v-if="notice" :title="notice" color="primary" variant="subtle" />

    <UCard v-if="settings">
      <template #header>
        <p class="font-semibold">Правила времени</p>
      </template>
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <UFormGroup label="Начало бесплатного окна"><UInput v-model="settings.free_start" type="time" /></UFormGroup>
        <UFormGroup label="Конец бесплатного окна"><UInput v-model="settings.free_end" type="time" /></UFormGroup>
        <UFormGroup label="Начало рабочего окна"><UInput v-model="settings.work_start" type="time" /></UFormGroup>
        <UFormGroup label="Конец рабочего окна"><UInput v-model="settings.work_end" type="time" /></UFormGroup>
        <UFormGroup label="Начало перерыва"><UInput v-model="settings.break_start" type="time" /></UFormGroup>
        <UFormGroup label="Конец перерыва"><UInput v-model="settings.break_end" type="time" /></UFormGroup>
        <UFormGroup label="Почасовой штраф"><UInput v-model.number="settings.hourly_penalty" type="number" /></UFormGroup>
        <UFormGroup label="Лимит долга (в часах)"><UInput v-model.number="settings.debt_block_hours" type="number" step="0.5" /></UFormGroup>
      </div>
      <div class="mt-3">
        <UButton label="Сохранить настройки" color="white" @click="saveSettings" />
      </div>
    </UCard>

    <div class="grid gap-4 xl:grid-cols-2">
      <UCard>
        <template #header><p class="font-semibold">Ограничения</p></template>
        <UForm :state="closureForm" class="space-y-3" @submit.prevent="createClosure">
          <UFormGroup label="Зона (необязательно)">
            <USelectMenu v-model="closureForm.zone_id" :options="zones" option-attribute="name" value-attribute="id" />
          </UFormGroup>
          <div class="grid gap-3 md:grid-cols-2">
            <UFormGroup label="Начало"><UInput v-model="closureForm.starts_at" type="datetime-local" required /></UFormGroup>
            <UFormGroup label="Конец"><UInput v-model="closureForm.ends_at" type="datetime-local" required /></UFormGroup>
          </div>
          <UFormGroup label="Причина"><UInput v-model="closureForm.reason" required /></UFormGroup>
          <UButton type="submit" label="Добавить ограничение" />
        </UForm>
      </UCard>

      <UCard>
        <template #header><p class="font-semibold">Загрузка шаблона</p></template>
        <div class="space-y-3">
          <p class="text-sm text-slate-500">Загрузите Excel-шаблон в хранилище <code>templates</code>.</p>
          <UInput type="file" accept=".xlsx,.xls" @change="(payload) => templateFile = getFirstFile(payload)" />
          <UButton label="Загрузить шаблон" @click="uploadTemplate" />
        </div>
      </UCard>
    </div>

    <UCard>
      <UTable
        :rows="closures"
        :columns="[
          { key: 'starts_at', label: 'Начало' },
          { key: 'ends_at', label: 'Конец' },
          { key: 'reason', label: 'Причина' },
          { key: 'is_active', label: 'Активно' },
          { key: 'actions', label: 'Действия' }
        ]"
      >
        <template #starts_at-data="{ row }">{{ new Date(row.starts_at).toLocaleString() }}</template>
        <template #ends_at-data="{ row }">{{ new Date(row.ends_at).toLocaleString() }}</template>
        <template #is_active-data="{ row }">
          <UBadge :label="row.is_active ? 'Да' : 'Нет'" :color="row.is_active ? 'green' : 'gray'" />
        </template>
        <template #actions-data="{ row }">
          <UButton size="xs" :label="row.is_active ? 'Выключить' : 'Включить'" @click="toggleClosure(row)" />
        </template>
      </UTable>
    </UCard>
  </div>
</template>
