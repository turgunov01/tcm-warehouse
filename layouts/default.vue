<script setup lang="ts">
import type { Database } from '~/types/database'

const route = useRoute()
const { user, profile, loadProfile, roleHome } = useAuthRbac()

const isLogin = computed(() => route.path === '/login')

onMounted(async () => {
  if (user.value && !profile.value) {
    await loadProfile()
  }
})

const links = computed(() => {
  const role = profile.value?.role
  if (role === 'admin') {
    return [
      { label: 'Панель', to: '/admin' },
      { label: 'Бронирования', to: '/admin/bookings' },
      { label: 'Зоны', to: '/admin/zones' },
      { label: 'Пользователи', to: '/admin/users' },
      { label: 'Настройки', to: '/admin/settings' },
      { label: 'Уведомления', to: '/admin/notifications' },
      { label: 'Аудит', to: '/admin/audit' }
    ]
  }
  if (role === 'tenant') {
    return [
      { label: 'Панель', to: '/tenant' },
      { label: 'Бронирования', to: '/tenant/bookings' },
      { label: 'История', to: '/tenant/history' },
      { label: 'Профиль', to: '/tenant/profile' },
      { label: 'Уведомления', to: '/tenant/notifications' }
    ]
  }
  if (role === 'guard') {
    return [
      { label: 'Зоны', to: '/guard' },
      { label: 'Бронирования на сегодня', to: '/guard/bookings' }
    ]
  }
  return []
})

const supabase = useSupabaseClient<Database>()

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/login')
}
</script>

<template>
  <div class="page-shell">
    <div v-if="isLogin">
      <slot />
    </div>
    <div v-else class="mx-auto flex max-w-[1440px] gap-4 p-4 lg:p-6">
      <aside class="hidden w-64 shrink-0 lg:block">
        <UCard>
          <template #header>
            <div class="space-y-1">
              <p class="text-sm text-slate-500">TCM Warehouse</p>
              <p class="font-semibold">{{ profile?.full_name || profile?.username || user?.email }}</p>
            </div>
          </template>
          <div class="space-y-2">
            <UButton
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              block
              color="white"
              variant="ghost"
              :label="link.label"
            />
          </div>
          <template #footer>
            <UButton label="Выйти" color="white" block @click="logout" />
          </template>
        </UCard>
      </aside>
      <main class="w-full min-w-0">
        <div class="mb-4 flex items-center justify-between lg:hidden">
          <UButton icon="i-heroicons-arrow-top-right-on-square" :to="roleHome(profile?.role)" label="Главная" />
          <UButton label="Выйти" color="white" variant="outline" @click="logout" />
        </div>
        <slot />
      </main>
    </div>
  </div>
</template>
