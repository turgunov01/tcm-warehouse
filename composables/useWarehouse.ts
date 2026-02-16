import type { BookingStatus, Database } from '~/types/database'

interface BookingFilters {
  from?: string
  to?: string
  statuses?: BookingStatus[]
  tenantIds?: string[]
  zoneId?: string
}

export const useWarehouse = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('*').eq('id', 1).single()
    return data
  }

  const fetchZones = async () => {
    const { data } = await supabase.from('zones').select('*').order('name')
    return data ?? []
  }

  const fetchBookings = async (filters: BookingFilters = {}) => {
    let query = supabase
      .from('bookings')
      .select('*, profiles!bookings_tenant_id_fkey(id, full_name, tenant_code)')
      .order('requested_datetime', { ascending: false })

    if (filters.from) {
      query = query.gte('requested_datetime', filters.from)
    }
    if (filters.to) {
      query = query.lte('requested_datetime', filters.to)
    }
    if (filters.statuses?.length) {
      query = query.in('status', filters.statuses)
    }
    if (filters.tenantIds?.length) {
      query = query.in('tenant_id', filters.tenantIds)
    }
    if (filters.zoneId) {
      query = query.eq('zone_id', filters.zoneId)
    }

    const { data, error } = await query
    if (error) {
      throw error
    }
    return data ?? []
  }

  const fetchRecentActivity = async (limit = 10) => {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    return data ?? []
  }

  const fetchNotifications = async () => {
    if (!user.value) {
      return []
    }
    const { data } = await supabase
      .from('notifications')
      .select('*, notification_reads(user_id, read_at)')
      .or(`recipient_id.is.null,recipient_id.eq.${user.value.id}`)
      .order('created_at', { ascending: false })

    return data ?? []
  }

  const markNotificationRead = async (notificationId: string) => {
    await supabase.from('notification_reads').upsert({ notification_id: notificationId })
  }

  const fetchTenantDebt = async (tenantId?: string) => {
    const target = tenantId || user.value?.id
    if (!target) {
      return 0
    }

    const { data, error } = await supabase.rpc('tenant_debt', { p_tenant_id: target })
    if (error) {
      return 0
    }
    return Number(data ?? 0)
  }

  return {
    fetchSettings,
    fetchZones,
    fetchBookings,
    fetchRecentActivity,
    fetchNotifications,
    markNotificationRead,
    fetchTenantDebt
  }
}
