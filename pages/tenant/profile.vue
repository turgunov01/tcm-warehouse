<script setup lang="ts">
import type { Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const { user, profile, loadProfile } = useAuthRbac()
const { roleLabel } = useRuLabels()

const form = reactive({
  full_name: '',
  phone: ''
})

const notice = ref('')

onMounted(async () => {
  const p = await loadProfile()
  form.full_name = p?.full_name || ''
  form.phone = p?.phone || ''
})

const save = async () => {
  if (!user.value) {
    return
  }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: form.full_name, phone: form.phone })
    .eq('id', user.value.id)

  notice.value = error ? error.message : 'Профиль обновлен.'
  await loadProfile()
}
</script>

<template>
  <div class="space-y-4 max-w-xl">
    <div>
      <h1 class="text-2xl font-semibold">Профиль</h1>
      <p class="text-sm text-slate-500">Обновите контактные данные.</p>
    </div>

    <UCard>
      <UForm :state="form" class="space-y-3" @submit.prevent="save">
        <UFormGroup label="ФИО"><UInput v-model="form.full_name" /></UFormGroup>
        <UFormGroup label="Телефон"><UInput v-model="form.phone" /></UFormGroup>
        <UButton type="submit" label="Сохранить" color="white" />
      </UForm>
      <p v-if="notice" class="mt-3 text-sm text-slate-600">{{ notice }}</p>
      <p class="mt-2 text-xs text-slate-500">Роль: {{ roleLabel(profile?.role) }}</p>
    </UCard>
  </div>
</template>
