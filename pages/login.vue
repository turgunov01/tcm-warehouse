<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()
const { loadProfile, roleHome } = useAuthRbac()

const form = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const errorText = ref('')

if (route.query.reason === 'profile_missing') {
  errorText.value = 'Аккаунт авторизован, но профиль отсутствует. Добавьте запись в public.profiles для этого пользователя.'
}

const redirectIfAuthed = async () => {
  const { data } = await supabase.auth.getSession()
  const sessionUser = data.session?.user

  if (!sessionUser) {
    return
  }

  const profile = await loadProfile(sessionUser.id)

  if (!profile) {
    return
  }

  await navigateTo(roleHome(profile.role), { replace: true })
}

onMounted(redirectIfAuthed)

const submit = async () => {
  loading.value = true
  errorText.value = ''

  try {
    const sessionPayload = await $fetch<{ access_token: string; refresh_token: string }>('/api/auth/login', {
      method: 'POST',
      body: {
        username: form.username,
        password: form.password
      }
    })

    const { data, error } = await supabase.auth.setSession({
      access_token: sessionPayload.access_token,
      refresh_token: sessionPayload.refresh_token
    })

    if (error) {
      errorText.value = error.message
      loading.value = false
      return
    }

    const profile = await loadProfile(data.user?.id)
    loading.value = false

    if (!profile) {
      errorText.value = 'Профиль не найден. Попросите администратора создать профиль в public.profiles.'
      return
    }

    await navigateTo(roleHome(profile.role), { replace: true })
  } catch (error: any) {
    errorText.value = error?.data?.statusMessage || error?.data?.message || error?.message || 'Не удалось выполнить вход'
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
    <UCard class="w-full">
      <template #header>
        <div class="space-y-1">
          <h1 class="text-xl font-semibold">Вход в TCM Warehouse</h1>
          <p class="text-sm text-slate-500">Используйте выданные учетные данные.</p>
        </div>
      </template>

      <UForm :state="form" class="space-y-3" @submit.prevent="submit">
        <UFormGroup label="Логин" name="username">
          <UInput v-model="form.username" required />
        </UFormGroup>

        <UFormGroup label="Пароль" name="password">
          <UInput v-model="form.password" type="password" required />
        </UFormGroup>

        <p v-if="errorText" class="text-sm text-rose-600">{{ errorText }}</p>

        <UButton type="submit" block color="white" :loading="loading" label="Войти" />
      </UForm>
    </UCard>
  </div>
</template>
