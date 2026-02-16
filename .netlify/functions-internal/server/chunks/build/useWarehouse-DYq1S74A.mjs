import { b as useSupabaseClient, f as useSupabaseUser } from './server.mjs';

const useWarehouse = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const fetchSettings = async () => {
    const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
    return data;
  };
  const fetchZones = async () => {
    const { data } = await supabase.from("zones").select("*").order("name");
    return data != null ? data : [];
  };
  const fetchBookings = async (filters = {}) => {
    var _a, _b;
    let query = supabase.from("bookings").select("*, profiles!bookings_tenant_id_fkey(id, full_name, tenant_code)").order("requested_datetime", { ascending: false });
    if (filters.from) {
      query = query.gte("requested_datetime", filters.from);
    }
    if (filters.to) {
      query = query.lte("requested_datetime", filters.to);
    }
    if ((_a = filters.statuses) == null ? void 0 : _a.length) {
      query = query.in("status", filters.statuses);
    }
    if ((_b = filters.tenantIds) == null ? void 0 : _b.length) {
      query = query.in("tenant_id", filters.tenantIds);
    }
    if (filters.zoneId) {
      query = query.eq("zone_id", filters.zoneId);
    }
    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return data != null ? data : [];
  };
  const fetchRecentActivity = async (limit = 10) => {
    const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(limit);
    return data != null ? data : [];
  };
  const fetchNotifications = async () => {
    if (!user.value) {
      return [];
    }
    const { data } = await supabase.from("notifications").select("*, notification_reads(user_id, read_at)").or(`recipient_id.is.null,recipient_id.eq.${user.value.id}`).order("created_at", { ascending: false });
    return data != null ? data : [];
  };
  const markNotificationRead = async (notificationId) => {
    await supabase.from("notification_reads").upsert({ notification_id: notificationId });
  };
  const fetchTenantDebt = async (tenantId) => {
    var _a;
    const target = tenantId || ((_a = user.value) == null ? void 0 : _a.id);
    if (!target) {
      return 0;
    }
    const { data, error } = await supabase.rpc("tenant_debt", { p_tenant_id: target });
    if (error) {
      return 0;
    }
    return Number(data != null ? data : 0);
  };
  return {
    fetchSettings,
    fetchZones,
    fetchBookings,
    fetchRecentActivity,
    fetchNotifications,
    markNotificationRead,
    fetchTenantDebt
  };
};

export { useWarehouse as u };
//# sourceMappingURL=useWarehouse-DYq1S74A.mjs.map
