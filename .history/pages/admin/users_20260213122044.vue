<script setup lang="ts">
import type { Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()

const zones = ref<Database['public']['Tables']['zones']['Row'][]>([])
const tenants = ref<Database['public']['Tables']['profiles']['Row'][]>([])
const creating = ref(false)
const bulkLoading = ref(false)
const result = ref('')

const form = reactive({
  email: '',
  password: '',
  role: 'tenant',
  full_name: '',
  phone: '',
  zone_id: '',
  tenant_code: ''
})

const load = async () => {
  const [zonesResp, usersResp] = await Promise.all([
    supabase.from('zones').select('*').order('name'),
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
  ])

  zones.value = zonesResp.data ?? []
  tenants.value = usersResp.data ?? []
}

const createSingle = async () => {
  creating.value = true
  result.value = ''

  const { error } = await $fetch('/api/admin/create-user', {
    method: 'POST',
    body: {
      ...form,
      zone_id: form.zone_id || null,
      tenant_code: form.tenant_code || null
    }
  }).then(() => ({ error: null as Error | null })).catch((err) => ({ error: err as Error }))

  creating.value = false
  if (error) {
    result.value = error.message
    return
  }

  result.value = 'User created.'
  form.email = ''
  form.password = ''
  form.full_name = ''
  form.phone = ''
  form.tenant_code = ''
  form.zone_id = ''
  await load()
}

const file = ref<File | null>(null)

const bulkUpload = async () => {
  if (!file.value) {
    return
  }

  bulkLoading.value = true
  result.value = ''

  const data = new FormData()
  data.append('file', file.value)

  try {
    const resp = await $fetch<{ inserted: number; failed: number }>('/api/admin/bulk-users', {
      method: 'POST',
      body: data
    })
    result.value = `Bulk upload completed. Inserted: ${resp.inserted}, Failed: ${resp.failed}`
    file.value = null
    await load()
  } catch (error: any) {
    result.value = error?.data?.message || error?.message || 'Bulk upload failed'
  } finally {
    bulkLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold">Users</h1>
      <p class="text-sm text-slate-500">Create one user or upload users from XLSX.</p>
    </div>

    <div class="grid gap-4 xl:grid-cols-2">
      <UCard>
        <template #header>
          <p class="font-semibold">Create Single User</p>
        </template>
        <UForm :state="form" class="space-y-3" @submit.prevent="createSingle">
          <div class="grid gap-3 md:grid-cols-2">
            <UFormGroup label="Email"><UInput v-model="form.email" type="email" required /></UFormGroup>
            <UFormGroup label="Password"><UInput v-model="form.password" type="password" required /></UFormGroup>
          </div>
          <div class="grid gap-3 md:grid-cols-2">
            <UFormGroup label="Role">
              <USelectMenu v-model="form.role" :options="['tenant', 'guard', 'admin']" />
            </UFormGroup>
            <UFormGroup label="Zone">
              <USelectMenu
                v-model="form.zone_id"
                :options="zones"
                option-attribute="name"
                value-attribute="id"
                placeholder="Optional"
              />
            </UFormGroup>
          </div>
          <div class="grid gap-3 md:grid-cols-2">
            <UFormGroup label="Full Name"><UInput v-model="form.full_name" /></UFormGroup>
            <UFormGroup label="Phone"><UInput v-model="form.phone" /></UFormGroup>
          </div>
          <UFormGroup label="Tenant Code"><UInput v-model="form.tenant_code" /></UFormGroup>
          <UButton type="submit" label="Create User" color="white" :loading="creating" />
        </UForm>
      </UCard>

      <UCard>
        <template #header>
          <p class="font-semibold">Bulk XLSX Upload</p>
        </template>
        <div class="space-y-3">
          <p class="text-sm text-slate-500">Expected columns: email, password, role, full_name, phone, zone_name, tenant_code</p>
          <UInput type="file" accept=".xlsx,.xls" @change="(event: Event) => file = (event.target as HTMLInputElement).files?.[0] || null" />
          <UButton label="Upload XLSX" :loading="bulkLoading" @click="bulkUpload" />
        </div>
      </UCard>
    </div>

    <UAlert v-if="result" :title="result" color="primary" variant="subtle" />

    <UCard>
      <UTable
        :rows="tenants"
        :columns="[
          { key: 'full_name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'phone', label: 'Phone' },
          { key: 'tenant_code', label: 'Code' }
        ]"
      />
    </UCard>
  </div>
</template>
