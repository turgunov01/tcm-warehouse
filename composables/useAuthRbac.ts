import type { Database } from '~/types/database'

export const useAuthRbac = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const profile = useState<Database['public']['Tables']['profiles']['Row'] | null>('profile', () => null)

  const roleHome = (role?: string | null) => {
    if (role === 'admin') {
      return '/admin'
    }
    if (role === 'guard') {
      return '/guard'
    }
    if (role === 'tenant') {
      return '/tenant'
    }
    return '/login'
  }

  const loadProfile = async (userId?: string | null) => {
    const targetUserId = userId || user.value?.id || null

    if (!targetUserId) {
      profile.value = null
      return null
    }

    if (profile.value?.id === targetUserId) {
      return profile.value
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single()

    if (error) {
      profile.value = null
      return null
    }

    profile.value = data
    return data
  }

  return {
    user,
    profile,
    roleHome,
    loadProfile
  }
}
