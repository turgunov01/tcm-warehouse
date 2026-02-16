import type { Database } from '~/types/database'

const publicRoutes = ['/login']

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/api/')) {
    return
  }

  const supabase = useSupabaseClient<Database>()
  const { user, loadProfile, profile, roleHome } = useAuthRbac()

  let authUser = user.value

  if (!authUser) {
    const { data } = await supabase.auth.getSession()
    authUser = data.session?.user ?? null
  }

  if (!authUser && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (!authUser) {
    return
  }

  const loadedProfile = await loadProfile(authUser.id)

  if (!loadedProfile) {
    if (to.path === '/login' && to.query.reason === 'profile_missing') {
      return
    }
    return navigateTo('/login?reason=profile_missing', { replace: true })
  }

  const role = loadedProfile.role

  if (to.path === '/login' || to.path === '/') {
    return navigateTo(roleHome(role), { replace: true })
  }

  if (to.path.startsWith('/admin') && role !== 'admin') {
    return navigateTo('/login')
  }

  if (to.path.startsWith('/tenant') && role !== 'tenant') {
    return navigateTo('/login')
  }

  if (to.path.startsWith('/guard') && role !== 'guard') {
    return navigateTo('/login')
  }
})
