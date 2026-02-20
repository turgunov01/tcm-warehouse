<script setup lang="ts">
import type { Database } from '~/types/database'

interface NavLink {
  label: string
  to: string
  icon: string
}

const route = useRoute()
const { user, profile, loadProfile, roleHome } = useAuthRbac()
const { fetchNotifications, markNotificationRead } = useWarehouse()

const isLogin = computed(() => route.path === '/login')
const unreadNotifications = ref<any[]>([])
const notificationsModalOpen = ref(false)
const markingAllRead = ref(false)
const unreadCount = computed(() => unreadNotifications.value.length)

const isRead = (row: any) => row.notification_reads?.length > 0

const loadUnreadNotifications = async () => {
  if (!user.value) {
    unreadNotifications.value = []
    notificationsModalOpen.value = false
    return
  }

  const rows = await fetchNotifications()
  unreadNotifications.value = (rows ?? []).filter((row: any) => !isRead(row))
  if (unreadNotifications.value.length > 0) {
    notificationsModalOpen.value = true
  }
}

onMounted(async () => {
  if (user.value && !profile.value) {
    await loadProfile()
  }
  if (user.value) {
    await loadUnreadNotifications()
  }
})

watch(
  () => user.value?.id,
  async (id) => {
    if (!id || isLogin.value) {
      unreadNotifications.value = []
      notificationsModalOpen.value = false
      return
    }
    await loadUnreadNotifications()
  }
)

watch(notificationsModalOpen, (open) => {
  if (!open && unreadNotifications.value.length > 0) {
    notificationsModalOpen.value = true
  }
})

const markOneRead = async (row: any) => {
  await markNotificationRead(row.id)
  await loadUnreadNotifications()
}

const markAllRead = async () => {
  if (!unreadNotifications.value.length) {
    notificationsModalOpen.value = false
    return
  }

  markingAllRead.value = true
  try {
    await Promise.all(unreadNotifications.value.map((row) => markNotificationRead(row.id)))
    await loadUnreadNotifications()
    notificationsModalOpen.value = false
  } finally {
    markingAllRead.value = false
  }
}

const links = computed<NavLink[]>(() => {
  const role = profile.value?.role
  if (role === 'admin') {
    return [
      { label: 'Панель', to: '/admin', icon: 'i-heroicons-squares-2x2' },
      { label: 'Бронирования', to: '/admin/bookings', icon: 'i-heroicons-calendar-days' },
      { label: 'Зоны', to: '/admin/zones', icon: 'i-heroicons-map' },
      { label: 'Пользователи', to: '/admin/users', icon: 'i-heroicons-users' },
      { label: 'Настройки', to: '/admin/settings', icon: 'i-heroicons-cog-6-tooth' },
      { label: 'Уведомления', to: '/admin/notifications', icon: 'i-heroicons-bell' },
      { label: 'Аудит', to: '/admin/audit', icon: 'i-heroicons-clipboard-document-list' }
    ]
  }
  if (role === 'tenant') {
    return [
      { label: 'Панель', to: '/tenant', icon: 'i-heroicons-home' },
      { label: 'Бронирования', to: '/tenant/bookings', icon: 'i-heroicons-calendar-days' },
      { label: 'История', to: '/tenant/history', icon: 'i-heroicons-clock' },
      { label: 'Профиль', to: '/tenant/profile', icon: 'i-heroicons-user-circle' },
      { label: 'Уведомления', to: '/tenant/notifications', icon: 'i-heroicons-bell' }
    ]
  }
  if (role === 'guard') {
    return [
      { label: 'Зоны', to: '/guard', icon: 'i-heroicons-map-pin' },
      { label: 'Сегодня', to: '/guard/bookings', icon: 'i-heroicons-calendar' }
    ]
  }
  return []
})

const mobileLinks = computed(() => links.value.slice(0, 5))

const isLinkActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`)

const supabase = useSupabaseClient<Database>()

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/login')
}
</script>

<template>
  <div class="page-shell">
    <AppHoloBackdrop v-if="!isLogin" />

    <div v-if="isLogin">
      <slot />
    </div>

    <div v-else class="app-chrome mx-auto flex w-full max-w-[1480px] gap-3 px-3 py-3 lg:gap-6 lg:px-6 lg:py-6">
      <aside class="hidden w-72 shrink-0 lg:block">
        <UCard class="glass-panel sticky top-4">
          <template #header>
            <div class="space-y-1">
              <p class="text-xs uppercase tracking-[0.24em] text-slate-400">TCM Warehouse</p>
              <p class="text-lg font-semibold">{{ profile?.full_name || profile?.username || user?.email }}</p>
            </div>
          </template>

          <div class="sidebar-nav space-y-2">
            <UButton
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              block
              class="sidebar-link"
              :icon="link.icon"
              :variant="isLinkActive(link.to) ? 'solid' : 'ghost'"
              color="white"
            >
              <span class="sidebar-link-text">{{ link.label }}</span>
              <span
                v-if="link.to.includes('/notifications') && unreadCount > 0"
                class="sidebar-link-dot"
                :title="`Непрочитанных: ${unreadCount}`"
              />
            </UButton>
          </div>

          <template #footer>
            <UButton label="Выйти" icon="i-heroicons-arrow-right-on-rectangle" color="white" block @click="logout" />
          </template>
        </UCard>
      </aside>

      <main class="w-full min-w-0 pb-24 lg:pb-0">
        <div class="glass-panel mb-3 rounded-2xl border border-white/10 bg-[color:var(--ui-surface)]/75 p-3 backdrop-blur-lg lg:hidden">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">TCM Warehouse</p>
              <p class="text-sm font-semibold">{{ profile?.full_name || profile?.username || user?.email }}</p>
            </div>
            <div class="flex items-center gap-2">
              <UButton icon="i-heroicons-home" :to="roleHome(profile?.role)" variant="ghost" color="white" />
              <UButton icon="i-heroicons-arrow-right-on-rectangle" variant="ghost" color="white" @click="logout" />
            </div>
          </div>
        </div>

        <slot />
      </main>
    </div>

    <nav v-if="!isLogin && mobileLinks.length" class="mobile-tabbar lg:hidden">
      <div class="grid gap-1" :style="{ gridTemplateColumns: `repeat(${mobileLinks.length}, minmax(0, 1fr))` }">
        <UButton
          v-for="link in mobileLinks"
          :key="link.to"
          :to="link.to"
          class="mobile-tab-btn relative"
          :icon="link.icon"
          :variant="isLinkActive(link.to) ? 'solid' : 'ghost'"
          color="white"
          size="xs"
          block
        >
          <span class="truncate text-[11px]">{{ link.label }}</span>
          <span v-if="link.to.includes('/notifications') && unreadCount > 0" class="mobile-tab-dot" />
        </UButton>
      </div>
    </nav>

    <UModal v-model="notificationsModalOpen" :prevent-close="unreadCount > 0">
      <UCard>
        <template #header>
          <p class="font-semibold">Новые уведомления</p>
        </template>

        <div class="space-y-3">
          <UCard v-for="row in unreadNotifications" :key="row.id">
            <div class="space-y-2">
              <p class="font-semibold">{{ row.title }}</p>
              <p class="text-sm text-slate-300">{{ row.body }}</p>
              <p class="text-xs text-slate-500">{{ new Date(row.created_at).toLocaleString() }}</p>
              <div class="flex justify-end">
                <UButton size="xs" label="Отметить прочитанным" @click="markOneRead(row)" />
              </div>
            </div>
          </UCard>
          <p v-if="!unreadNotifications.length" class="text-sm text-slate-500">Непрочитанных уведомлений нет.</p>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <UButton
            label="Отметить все прочитанным"
            color="white"
            :loading="markingAllRead"
            :disabled="!unreadNotifications.length"
            @click="markAllRead"
          />
        </div>
      </UCard>
    </UModal>
  </div>
</template>
