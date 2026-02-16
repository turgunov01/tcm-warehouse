<script setup lang="ts">
import type { Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const { roleLabel } = useRuLabels()

const recipients = ref<Array<{ id: string; full_name: string | null; role: Database['public']['Tables']['profiles']['Row']['role']; label: string }>>([])
const rows = ref<Database['public']['Tables']['notifications']['Row'][]>([])
const form = reactive({
  title: '',
  body: '',
  recipient_id: ''
})
const notice = ref('')

const load = async () => {
  const [recipientsResp, notificationResp] = await Promise.all([
    supabase.from('profiles').select('id, full_name, role').order('full_name'),
    supabase.from('notifications').select('*').order('created_at', { ascending: false })
  ])

  recipients.value = (recipientsResp.data ?? []).map((recipient) => ({
    ...recipient,
    label: `[${recipient.full_name || 'Без имени'}] [${roleLabel(recipient.role)}]`
  }))
  rows.value = notificationResp.data ?? []
}

const tableRows = computed(() =>
  rows.value.map((row) => ({
    ...row,
    recipient_display: row.recipient_id || 'Всем пользователям'
  }))
)

const send = async () => {
  const { error } = await supabase.from('notifications').insert({
    title: form.title,
    body: form.body,
    recipient_id: form.recipient_id || null
  })

  notice.value = error ? error.message : 'Уведомление отправлено.'
  form.title = ''
  form.body = ''
  form.recipient_id = ''
  await load()
}

onMounted(load)
</script>

<template>
  <div class="space-y-4 admin-page-content">
    <div>
      <h1 class="text-2xl font-semibold">Уведомления</h1>
      <p class="text-sm text-slate-500">Создавайте массовые или персональные уведомления.</p>
    </div>

    <UAlert v-if="notice" :title="notice" color="primary" variant="subtle" />

    <UCard>
      <UForm :state="form" class="space-y-3" @submit.prevent="send">
        <UFormGroup label="Заголовок">
          <UInput v-model="form.title" required />
        </UFormGroup>
        <UFormGroup label="Сообщение">
          <UTextarea v-model="form.body" required />
        </UFormGroup>
        <UFormGroup label="Получатель (пусто = всем)">
          <USelectMenu
            v-model="form.recipient_id"
            :options="recipients"
            option-attribute="label"
            value-attribute="id"
            searchable
            placeholder="Все пользователи"
            clear-search-on-close
          />
        </UFormGroup>
        <UButton type="submit" label="Отправить" color="white" />
      </UForm>
    </UCard>

    <UCard>
      <UTable
        :rows="tableRows"
        :columns="[
          { key: 'created_at', label: 'Создано' },
          { key: 'title', label: 'Заголовок' },
          { key: 'body', label: 'Сообщение' },
          { key: 'recipient_display', label: 'Получатель' }
        ]"
      >
        <template #created_at-data="{ row }">{{ new Date(row.created_at).toLocaleString() }}</template>
      </UTable>
    </UCard>
  </div>
</template>
