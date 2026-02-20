<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()
const { loadProfile, roleHome } = useAuthRbac()
const { animateIn } = useGsap()
const { allowHolograms, motionLevel } = useMotionProfile()

const form = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const errorText = ref('')
const loginScene = ref<HTMLElement | null>(null)
const loginCard = ref<HTMLElement | null>(null)
const loginCopy = ref<HTMLElement | null>(null)
const prismStyle = ref<Record<string, string>>({})
let unbindCardMotion: (() => void) | null = null
const labels = {
  headerTitle: '\u0412\u0445\u043e\u0434 \u0432 TCM Warehouse',
  headerDesc: '\u0410\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u044f \u0432 \u0437\u0430\u0449\u0438\u0449\u0435\u043d\u043d\u0443\u044e \u0441\u0438\u0441\u0442\u0435\u043c\u0443 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u0441\u043a\u043b\u0430\u0434\u043e\u043c.',
  username: '\u041b\u043e\u0433\u0438\u043d',
  password: '\u041f\u0430\u0440\u043e\u043b\u044c',
  submit: '\u0412\u043e\u0439\u0442\u0438'
}

if (route.query.reason === 'profile_missing') {
  errorText.value = '\u0410\u043a\u043a\u0430\u0443\u043d\u0442 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u043e\u0432\u0430\u043d, \u043d\u043e \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u043e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442. \u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u0437\u0430\u043f\u0438\u0441\u044c \u0432 public.profiles \u0434\u043b\u044f \u044d\u0442\u043e\u0433\u043e \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f.'
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

const syncTilt = (xTilt: number, yTilt: number, xGlow: number, yGlow: number) => {
  if (!loginCard.value) {
    return
  }
  loginCard.value.style.setProperty('--login-tilt-x', `${xTilt.toFixed(2)}deg`)
  loginCard.value.style.setProperty('--login-tilt-y', `${yTilt.toFixed(2)}deg`)
  loginCard.value.style.setProperty('--login-glow-x', `${xGlow.toFixed(1)}%`)
  loginCard.value.style.setProperty('--login-glow-y', `${yGlow.toFixed(1)}%`)
}

const resetTilt = () => {
  syncTilt(0, 0, 50, 44)
  prismStyle.value = { transform: 'translate3d(0px, 0px, 0)' }
}

const bindCardMotion = () => {
  if (!import.meta.client || !loginScene.value || motionLevel.value !== 'full') {
    return () => {}
  }

  const scene = loginScene.value
  const move = (event: PointerEvent) => {
    const rect = scene.getBoundingClientRect()
    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1)
    const xTilt = (0.5 - x) * 6.2
    const yTilt = (y - 0.5) * 5.4
    syncTilt(xTilt, yTilt, x * 100, y * 100)
    prismStyle.value = {
      transform: `translate3d(${(x - 0.5) * 20}px, ${(y - 0.5) * 16}px, 0)`
    }
  }

  const leave = () => {
    resetTilt()
  }

  scene.addEventListener('pointermove', move, { passive: true })
  scene.addEventListener('pointerleave', leave)
  window.addEventListener('blur', leave)
  resetTilt()

  return () => {
    scene.removeEventListener('pointermove', move)
    scene.removeEventListener('pointerleave', leave)
    window.removeEventListener('blur', leave)
  }
}

onMounted(async () => {
  await redirectIfAuthed()

  if (loginCard.value) {
    await animateIn(loginCard.value, { duration: 0.52, y: 14 })
  }

  if (loginCopy.value && motionLevel.value === 'full') {
    await animateIn(loginCopy.value, { duration: 0.42, y: 8, delay: 0.06 })
  }

  unbindCardMotion = bindCardMotion()
})

watch(
  () => motionLevel.value,
  () => {
    if (unbindCardMotion) {
      unbindCardMotion()
      unbindCardMotion = null
    }
    if (motionLevel.value === 'full') {
      unbindCardMotion = bindCardMotion()
      return
    }
    resetTilt()
  }
)

onBeforeUnmount(() => {
  if (unbindCardMotion) {
    unbindCardMotion()
    unbindCardMotion = null
  }
})

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
      errorText.value = '\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d. \u041f\u043e\u043f\u0440\u043e\u0441\u0438\u0442\u0435 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430 \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0432 public.profiles.'
      return
    }

    await navigateTo(roleHome(profile.role), { replace: true })
  } catch (error: any) {
    errorText.value = error?.data?.statusMessage || error?.data?.message || error?.message || '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u0432\u0445\u043e\u0434'
    loading.value = false
  }
}
</script>

<template>
  <div ref="loginScene" class="login-scene">
    <template v-if="allowHolograms">
      <div class="login-hologram-grid" :class="{ 'is-soft': motionLevel !== 'full' }" aria-hidden="true" />
      <div class="login-hologram-ring login-hologram-ring-a" :class="{ 'is-static': motionLevel !== 'full' }" aria-hidden="true" />
      <div class="login-hologram-ring login-hologram-ring-b" :class="{ 'is-static': motionLevel !== 'full' }" aria-hidden="true" />
      <div class="login-hologram-orbit login-hologram-orbit-a" :class="{ 'is-soft': motionLevel !== 'full' }" aria-hidden="true" />
      <div class="login-hologram-orbit login-hologram-orbit-b" :class="{ 'is-soft': motionLevel !== 'full' }" aria-hidden="true" />
      <div class="login-hologram-prism" :style="prismStyle" :class="{ 'is-soft': motionLevel !== 'full' }" aria-hidden="true" />
      <div class="login-hologram-particle-field" :class="{ 'is-soft': motionLevel !== 'full' }" aria-hidden="true" />
      <div class="login-hologram-scan" :class="{ 'is-static': motionLevel !== 'full' }" aria-hidden="true" />
    </template>

    <div class="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div ref="loginCard" class="login-card-shell w-full">
        <UCard class="login-card w-full">
          <template #header>
            <div ref="loginCopy" class="space-y-1">
              <h1 class="text-xl font-semibold">{{ labels.headerTitle }}</h1>
              <p class="text-sm text-slate-400">{{ labels.headerDesc }}</p>
            </div>
          </template>

          <UForm :state="form" class="space-y-3" @submit.prevent="submit">
            <UFormGroup :label="labels.username" name="username">
              <UInput v-model="form.username" required autocomplete="username" />
            </UFormGroup>

            <UFormGroup :label="labels.password" name="password">
              <UInput v-model="form.password" type="password" required autocomplete="current-password" />
            </UFormGroup>

            <p v-if="errorText" class="text-sm text-rose-400">{{ errorText }}</p>

            <UButton type="submit" block color="white" :loading="loading" :label="labels.submit" />
          </UForm>
        </UCard>
      </div>
    </div>
  </div>
</template>
