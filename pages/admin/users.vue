<script setup lang="ts">
import type { Database } from "~/types/database";

const supabase = useSupabaseClient<Database>();
const { getFirstFile } = useFileInput();
const { roleLabel } = useRuLabels();

const zones = ref<Database["public"]["Tables"]["zones"]["Row"][]>([]);
const tenants = ref<Database["public"]["Tables"]["profiles"]["Row"][]>([]);
const creating = ref(false);
const bulkLoading = ref(false);
const result = ref("");
const roleOptions = [
  { label: "Арендатор", value: "tenant" },
  { label: "Охрана", value: "guard" },
  { label: "Администратор", value: "admin" },
];

const form = reactive({
  username: "",
  email: "",
  password: "",
  role: "tenant",
  full_name: "",
  phone: "",
  zone_id: "",
  tenant_code: "",
});

const load = async () => {
  const [zonesResp, usersResp] = await Promise.all([
    supabase.from("zones").select("*").order("name"),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
  ]);

  zones.value = zonesResp.data ?? [];
  tenants.value = usersResp.data ?? [];
};

const createSingle = async () => {
  creating.value = true;
  result.value = "";

  const { error } = await $fetch("/api/admin/create-user", {
    method: "POST",
    body: {
      ...form,
      zone_id: form.zone_id || null,
      tenant_code: form.tenant_code || null,
    },
  })
    .then(() => ({ error: null as Error | null }))
    .catch((err) => ({ error: err as Error }));

  creating.value = false;
  if (error) {
    result.value = error.message;
    return;
  }

  result.value = "Пользователь создан.";
  form.username = "";
  form.email = "";
  form.password = "";
  form.full_name = "";
  form.phone = "";
  form.tenant_code = "";
  form.zone_id = "";
  await load();
};

const file = ref<File | null>(null);

const bulkUpload = async () => {
  if (!file.value) {
    result.value = "Сначала выберите Excel-файл.";
    return;
  }

  bulkLoading.value = true;
  result.value = "";

  const data = new FormData();
  data.append("file", file.value);

  try {
    const resp = await $fetch<{ inserted: number; failed: number }>(
      "/api/admin/bulk-users",
      {
        method: "POST",
        body: data,
      }
    );
    result.value = `Массовая загрузка завершена. Добавлено: ${resp.inserted}, Ошибок: ${resp.failed}`;
    file.value = null;
    await load();
  } catch (error: any) {
    result.value = error?.data?.message || error?.message || "Не удалось загрузить файл";
  } finally {
    bulkLoading.value = false;
  }
};

onMounted(load);
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold">Пользователи</h1>
      <p class="text-sm text-slate-500">Создайте пользователя вручную или загрузите список из XLSX.</p>
    </div>

    <div class="grid gap-4 xl:grid-cols-2">
      <UCard>
        <template #header>
          <p class="font-semibold">Создание одного пользователя</p>
        </template>
        <UForm :state="form" class="space-y-3" @submit.prevent="createSingle">
          <div class="grid gap-3 md:grid-cols-2">
            <UFormGroup label="Логин"
              ><UInput v-model="form.username" required
            /></UFormGroup>
            <UFormGroup label="Email"
              ><UInput v-model="form.email" type="email" required
            /></UFormGroup>
          </div>
          <div class="grid gap-3 md:grid-cols-2">
            <UFormGroup label="Пароль"
              ><UInput v-model="form.password" type="password" required
            /></UFormGroup>
            <UFormGroup label="Роль">
              <USelectMenu
                v-model="form.role"
                :options="roleOptions"
                option-attribute="label"
                value-attribute="value"
              />
            </UFormGroup>
            <UFormGroup label="Зона">
              <USelectMenu
                v-model="form.zone_id"
                :options="zones"
                option-attribute="name"
                value-attribute="id"
                placeholder="Необязательно"
              />
            </UFormGroup>
          </div>
          <div class="grid gap-3 md:grid-cols-2">
            <UFormGroup label="ФИО"><UInput v-model="form.full_name" /></UFormGroup>
            <UFormGroup label="Телефон"><UInput v-model="form.phone" /></UFormGroup>
          </div>
          <UFormGroup label="Код арендатора"
            ><UInput v-model="form.tenant_code"
          /></UFormGroup>
          <UButton type="submit" label="Создать пользователя" color="white" :loading="creating" />
        </UForm>
      </UCard>

      <UCard>
        <template #header>
          <p class="font-semibold">Массовая загрузка XLSX</p>
        </template>
        <div class="space-y-3">
          <p class="text-sm text-slate-500">
            Поддерживаемые форматы: .xlsx и .xls. Ожидаемые колонки: email, password,
            role, full_name, phone, zone_name, tenant_code, username(необязательно)
          </p>
          <UInput
            type="file"
            accept=".xlsx,.xls"
            @change="(payload) => file = getFirstFile(payload)"
          />
          <UButton label="Загрузить XLSX" :loading="bulkLoading" @click="bulkUpload" />
        </div>
      </UCard>
    </div>

    <UAlert v-if="result" :title="result" color="primary" variant="subtle" />

    <UCard>
      <UTable
        :rows="tenants"
        :columns="[
          { key: 'username', label: 'Логин' },
          { key: 'email', label: 'Email' },
          { key: 'full_name', label: 'Имя' },
          { key: 'role', label: 'Роль' },
          { key: 'phone', label: 'Телефон' },
          { key: 'tenant_code', label: 'Код' },
        ]"
      >
        <template #role-data="{ row }">
          {{ roleLabel(row.role) }}
        </template>
      </UTable>
    </UCard>
  </div>
</template>
