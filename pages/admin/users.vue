<script setup lang="ts">
import type { Database } from "~/types/database";

const supabase = useSupabaseClient<Database>();
const { getFirstFile } = useFileInput();
const { roleLabel } = useRuLabels();
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const zones = ref<Database["public"]["Tables"]["zones"]["Row"][]>([]);
const tenants = ref<ProfileRow[]>([]);
const creating = ref(false);
const bulkLoading = ref(false);
const saving = ref(false);
const result = ref("");
const createConfirmOpen = ref(false);
const editConfirmOpen = ref(false);
const detailsOpen = ref(false);
const editMode = ref(false);
const selectedTenant = ref<ProfileRow | null>(null);
const usersPage = ref(1);
const usersTotal = ref(0);
const usersPageSize = 25;
const detailsColumns = [
  { key: "username", label: "Логин" },
  { key: "email", label: "Email" },
  { key: "full_name", label: "Имя" },
  { key: "role", label: "Роль" },
  { key: "zone_id", label: "Зона" },
  { key: "phone", label: "Телефон" },
  { key: "tenant_code", label: "Код" },
  { key: "actions", label: "Действия" },
];
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

const detailsForm = reactive({
  username: "",
  email: "",
  password: "",
  role: "tenant" as ProfileRow["role"],
  full_name: "",
  phone: "",
  zone_id: "",
  tenant_code: "",
});

const applyTenantToForm = (row: ProfileRow) => {
  detailsForm.username = row.username || "";
  detailsForm.email = row.email || "";
  detailsForm.password = "";
  detailsForm.role = row.role;
  detailsForm.full_name = row.full_name || "";
  detailsForm.phone = row.phone || "";
  detailsForm.zone_id = row.zone_id || "";
  detailsForm.tenant_code = row.tenant_code || "";
};

const zoneNameById = (zoneId?: string | null) => {
  if (!zoneId) {
    return "Не указана";
  }
  return zones.value.find((zone) => zone.id === zoneId)?.name || zoneId;
};

const openDetails = (row: ProfileRow, mode: "view" | "edit" = "view") => {
  selectedTenant.value = row;
  editMode.value = mode === "edit";
  applyTenantToForm(row);
  detailsOpen.value = true;
};

const toNullable = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const setViewMode = () => {
  if (!selectedTenant.value) {
    editMode.value = false;
    return;
  }
  applyTenantToForm(selectedTenant.value);
  editMode.value = false;
};

const saveDetails = async () => {
  if (!selectedTenant.value) {
    return;
  }

  saving.value = true;
  result.value = "";

  const username = detailsForm.username.trim();
  const email = detailsForm.email.trim();

  const body: Record<string, any> = {
    id: selectedTenant.value.id,
    role: detailsForm.role,
    full_name: toNullable(detailsForm.full_name),
    phone: toNullable(detailsForm.phone),
    zone_id: detailsForm.zone_id || null,
    tenant_code: toNullable(detailsForm.tenant_code),
  };

  if (username) {
    body.username = username;
  }

  if (email) {
    body.email = email;
  }

  if (detailsForm.password.trim()) {
    body.password = detailsForm.password.trim();
  }

  const { error } = await $fetch("/api/admin/update-user", {
    method: "POST",
    body,
  })
    .then(() => ({ error: null as Error | null }))
    .catch((err: any) => ({
      error: new Error(err?.data?.statusMessage || err?.data?.message || err?.message || "Не удалось обновить пользователя"),
    }));

  saving.value = false;
  if (error) {
    result.value = error.message;
    return;
  }

  result.value = "Данные пользователя обновлены.";
  await loadUsers();
  const refreshed = tenants.value.find((row) => row.id === selectedTenant.value?.id) || null;
  selectedTenant.value = refreshed;
  if (refreshed) {
    applyTenantToForm(refreshed);
  }
  editMode.value = false;
};

const loadZones = async () => {
  const { data } = await supabase.from("zones").select("*").order("name");
  zones.value = data ?? [];
};

const loadUsers = async () => {
  const from = (usersPage.value - 1) * usersPageSize;
  const to = from + usersPageSize - 1;
  const { data, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  tenants.value = data ?? [];
  usersTotal.value = count ?? 0;

  const totalPages = Math.max(1, Math.ceil(usersTotal.value / usersPageSize));
  if (usersPage.value > totalPages) {
    usersPage.value = totalPages;
  }
};

const load = async () => {
  await Promise.all([loadZones(), loadUsers()]);
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
  usersPage.value = 1;
  await loadUsers();
};

const requestCreateSingle = () => {
  createConfirmOpen.value = true;
};

const requestSaveDetails = () => {
  if (!selectedTenant.value) {
    return;
  }
  editConfirmOpen.value = true;
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
    usersPage.value = 1;
    await loadUsers();
  } catch (error: any) {
    result.value = error?.data?.message || error?.message || "Не удалось загрузить файл";
  } finally {
    bulkLoading.value = false;
  }
};

watch(detailsOpen, (isOpen) => {
  if (isOpen || !selectedTenant.value) {
    return;
  }
  setViewMode();
});

watch(usersPage, loadUsers);

onMounted(load);
</script>

<template>
  <div class="space-y-4 admin-page-content">
    <div>
      <h1 class="text-2xl font-semibold">Пользователи</h1>
      <p class="text-sm text-slate-500">Создайте пользователя вручную или загрузите список из XLSX.</p>
    </div>

    <div class="grid gap-4 xl:grid-cols-2">
      <UCard>
        <template #header>
          <p class="font-semibold">Создание одного пользователя</p>
        </template>
        <UForm :state="form" class="space-y-3" @submit.prevent="requestCreateSingle">
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
        :columns="detailsColumns"
      >
        <template #role-data="{ row }">
          {{ roleLabel(row.role) }}
        </template>
        <template #zone_id-data="{ row }">
          {{ zoneNameById(row.zone_id) }}
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" variant="ghost" label="Просмотр" @click="openDetails(row, 'view')" />
            <UButton size="xs" label="Редактировать" @click="openDetails(row, 'edit')" />
          </div>
        </template>
      </UTable>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-slate-500">Всего пользователей: {{ usersTotal }}</p>
        <UPagination v-model="usersPage" :total="usersTotal" :page-count="usersPageSize" />
      </div>
    </UCard>

    <UModal v-model="detailsOpen">
      <UCard>
        <template #header>
          <p class="font-semibold">{{ editMode ? "Редактирование пользователя" : "Данные арендатора" }}</p>
        </template>

        <div v-if="selectedTenant" class="space-y-3">
          <div class="grid gap-3 md:grid-cols-2">
            <UFormGroup label="Логин">
              <UInput v-model="detailsForm.username" :disabled="!editMode" />
            </UFormGroup>
            <UFormGroup label="Email">
              <UInput v-model="detailsForm.email" type="email" :disabled="!editMode" />
            </UFormGroup>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <UFormGroup label="Имя и фамилия">
              <UInput v-model="detailsForm.full_name" :disabled="!editMode" />
            </UFormGroup>
            <UFormGroup label="Телефон">
              <UInput v-model="detailsForm.phone" :disabled="!editMode" />
            </UFormGroup>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <UFormGroup label="Роль">
              <USelectMenu
                v-model="detailsForm.role"
                :options="roleOptions"
                option-attribute="label"
                value-attribute="value"
                :disabled="!editMode"
              />
            </UFormGroup>
            <UFormGroup label="Зона">
              <USelectMenu
                v-model="detailsForm.zone_id"
                :options="zones"
                option-attribute="name"
                value-attribute="id"
                placeholder="Необязательно"
                :disabled="!editMode"
              />
            </UFormGroup>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <UFormGroup label="Код арендатора">
              <UInput v-model="detailsForm.tenant_code" :disabled="!editMode" />
            </UFormGroup>
            <UFormGroup label="Новый пароль">
              <UInput
                v-model="detailsForm.password"
                type="password"
                placeholder="Оставьте пустым, чтобы не менять"
                :disabled="!editMode"
              />
            </UFormGroup>
          </div>

          <p v-if="!editMode" class="text-xs text-slate-500">
            Зона: {{ zoneNameById(detailsForm.zone_id) }}.
          </p>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <UButton v-if="!editMode" label="Редактировать" type="button" @click="editMode = true" />
          <UButton v-if="editMode" label="Отмена" type="button" variant="ghost" @click="setViewMode" />
          <UButton v-if="editMode" label="Сохранить" type="button" color="white" :loading="saving" @click="requestSaveDetails" />
          <UButton v-if="!editMode" label="Закрыть" type="button" variant="ghost" @click="detailsOpen = false" />
        </div>
      </UCard>
    </UModal>

    <UModal v-model="createConfirmOpen">
      <UCard>
        <template #header>
          <p class="font-semibold">Подтвердите создание</p>
        </template>
        <p class="text-sm text-slate-700">Вы точно хотите создать пользователя с указанными данными?</p>
        <div class="mt-4 flex justify-end gap-2">
          <UButton label="Отмена" type="button" variant="ghost" @click="createConfirmOpen = false" />
          <UButton
            label="Да, создать"
            type="button"
            color="white"
            :loading="creating"
            @click="createConfirmOpen = false; createSingle()"
          />
        </div>
      </UCard>
    </UModal>

    <UModal v-model="editConfirmOpen">
      <UCard>
        <template #header>
          <p class="font-semibold">Подтвердите сохранение</p>
        </template>
        <p class="text-sm text-slate-700">Вы точно хотите сохранить изменения пользователя?</p>
        <div class="mt-4 flex justify-end gap-2">
          <UButton label="Отмена" type="button" variant="ghost" @click="editConfirmOpen = false" />
          <UButton
            label="Да, сохранить"
            type="button"
            color="white"
            :loading="saving"
            @click="editConfirmOpen = false; saveDetails()"
          />
        </div>
      </UCard>
    </UModal>
  </div>
</template>
