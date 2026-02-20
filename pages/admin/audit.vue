<script setup lang="ts">
import type { Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const { actionLabel, tableLabel } = useRuLabels()

type AuditRow = Database['public']['Tables']['audit_logs']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']
interface AuditTableRow {
  id: string
  table_name: string
  record_id: string | null
  action: string
  old_data: unknown
  new_data: unknown
  actor_id: string | null
  created_at: string
}

const rows = ref<AuditTableRow[]>([])
const profileNames = ref<Record<string, string>>({})
const tableFilter = ref('')
const actionFilter = ref('')
const auditPage = ref(1)
const auditTotal = ref(0)
const auditPageSize = 30

const asObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }
  return value as Record<string, unknown>
}

const profileLabelById = (id?: string | null) => {
  if (!id) {
    return 'Система'
  }
  return profileNames.value[id] || id
}

const tenantLabelFromRow = (row: AuditTableRow) => {
  const payloadNew = asObject(row.new_data)
  const payloadOld = asObject(row.old_data)
  const tenantId = payloadNew?.tenant_id ?? payloadOld?.tenant_id

  if (typeof tenantId !== 'string') {
    return '—'
  }

  return profileLabelById(tenantId)
}

const collectProfileIds = (auditRows: AuditTableRow[]) => {
  const ids = new Set<string>()

  for (const row of auditRows) {
    if (row.actor_id) {
      ids.add(row.actor_id)
    }

    const payloadNew = asObject(row.new_data)
    const payloadOld = asObject(row.old_data)
    const tenantId = payloadNew?.tenant_id ?? payloadOld?.tenant_id
    if (typeof tenantId === 'string') {
      ids.add(tenantId)
    }
  }

  return Array.from(ids)
}

const loadMissingProfiles = async (ids: string[]) => {
  const missingIds = ids.filter((id) => !profileNames.value[id])
  if (!missingIds.length) {
    return
  }

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, username, email')
    .in('id', missingIds)

  const nextEntries = ((data ?? []) as Pick<ProfileRow, 'id' | 'full_name' | 'username' | 'email'>[]).map((profile) => [
    profile.id,
    profile.full_name || profile.username || profile.email || profile.id
  ])

  profileNames.value = {
    ...profileNames.value,
    ...Object.fromEntries(nextEntries)
  }
}

const load = async () => {
  const from = (auditPage.value - 1) * auditPageSize
  const to = from + auditPageSize - 1
  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (tableFilter.value) {
    query = query.eq('table_name', tableFilter.value)
  }
  if (actionFilter.value) {
    query = query.eq('action', actionFilter.value)
  }

  const auditResp = await query
  rows.value = (auditResp.data as unknown as AuditTableRow[]) ?? []
  auditTotal.value = auditResp.count ?? 0
  const profileIds = collectProfileIds(rows.value)
  await loadMissingProfiles(profileIds)

  const totalPages = Math.max(1, Math.ceil(auditTotal.value / auditPageSize))
  if (auditPage.value > totalPages) {
    auditPage.value = totalPages
  }
}

onMounted(load)
watch([tableFilter, actionFilter], () => {
  auditPage.value = 1
  load()
})
watch(auditPage, load)
</script>

<template>
  <div class="space-y-4 admin-page-content">
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
          { key: 'tenant_name', label: 'Арендатор' },
          { key: 'record_id', label: 'Запись' },
          { key: 'actor_name', label: 'Кто изменил' }
        ]"
      >
        <template #created_at-data="{ row }">{{ new Date(row.created_at).toLocaleString() }}</template>
        <template #table_name-data="{ row }">{{ tableLabel(row.table_name) }}</template>
        <template #action-data="{ row }">{{ actionLabel(row.action) }}</template>
        <template #tenant_name-data="{ row }">{{ tenantLabelFromRow(row) }}</template>
        <template #actor_name-data="{ row }">{{ profileLabelById(row.actor_id) }}</template>
      </UTable>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-slate-500">Всего записей: {{ auditTotal }}</p>
        <UPagination v-model="auditPage" :total="auditTotal" :page-count="auditPageSize" />
      </div>
    </UCard>
  </div>
</template>
