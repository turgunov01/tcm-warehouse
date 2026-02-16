<script setup lang="ts">
import type { Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { fetchBookings } = useWarehouse()
const { bookingStatusLabel } = useRuLabels()

const rows = ref<any[]>([])
const selected = ref<any | null>(null)
const open = ref(false)
const loadingDocs = ref(false)
const docsError = ref('')
const docUrls = reactive({
  passportFront: '',
  passportBack: '',
  platePhoto: ''
})

const load = async () => {
  if (!user.value?.id) {
    rows.value = []
    return
  }

  rows.value = await fetchBookings({ tenantIds: [user.value.id] })
}

const createSignedDocumentUrl = async (path?: string | null) => {
  if (!path) {
    return ''
  }

  const { data, error } = await supabase.storage.from('documents').createSignedUrl(path, 60 * 30)
  if (error) {
    return ''
  }

  return data?.signedUrl || ''
}

const showDetails = async (row: any) => {
  selected.value = row
  open.value = true
  docsError.value = ''
  loadingDocs.value = true

  try {
    const [passportFront, passportBack, platePhoto] = await Promise.all([
      createSignedDocumentUrl(row.driver_passport_front),
      createSignedDocumentUrl(row.driver_passport_back),
      createSignedDocumentUrl(row.car_plate_photo)
    ])

    docUrls.passportFront = passportFront
    docUrls.passportBack = passportBack
    docUrls.platePhoto = platePhoto
  } catch {
    docsError.value = 'Не удалось загрузить предпросмотр документов.'
    docUrls.passportFront = ''
    docUrls.passportBack = ''
    docUrls.platePhoto = ''
  } finally {
    loadingDocs.value = false
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    return
  }

  docsError.value = ''
  docUrls.passportFront = ''
  docUrls.passportBack = ''
  docUrls.platePhoto = ''
})

onMounted(load)

watch(
  () => user.value?.id,
  () => {
    load()
  }
)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold">История</h1>
      <p class="text-sm text-slate-500">Все прошлые бронирования и предпросмотр документов водителя.</p>
    </div>

    <UCard>
      <UTable
        :rows="rows"
        :columns="[
          { key: 'requested_datetime', label: 'Дата' },
          { key: 'status', label: 'Статус' },
          { key: 'driver_name', label: 'Водитель' },
          { key: 'actions', label: 'Действия' }
        ]"
      >
        <template #status-data="{ row }">{{ bookingStatusLabel(row.status) }}</template>
        <template #requested_datetime-data="{ row }">{{ new Date(row.requested_datetime).toLocaleString() }}</template>
        <template #actions-data="{ row }">
          <UButton size="xs" label="Просмотр" @click="showDetails(row)" />
        </template>
      </UTable>
    </UCard>

    <UModal v-model="open">
      <UCard>
        <template #header>
          <p class="font-semibold">Данные водителя</p>
        </template>
        <div v-if="selected" class="space-y-3 text-sm">
          <p><strong>Имя:</strong> {{ selected.driver_name }}</p>
          <p><strong>Номер машины:</strong> {{ selected.car_plate_text }}</p>

          <div class="grid gap-3 md:grid-cols-2">
            <div>
              <p class="mb-1 font-semibold">Паспорт (лицевая сторона)</p>
              <img
                v-if="docUrls.passportFront"
                :src="docUrls.passportFront"
                alt="Паспорт лицевая сторона"
                class="h-44 w-full rounded border border-[#eeeeee] object-cover"
              >
              <p v-else-if="loadingDocs">Загрузка...</p>
              <p v-else>Предпросмотр недоступен.</p>
            </div>

            <div>
              <p class="mb-1 font-semibold">Паспорт (обратная сторона)</p>
              <img
                v-if="docUrls.passportBack"
                :src="docUrls.passportBack"
                alt="Паспорт обратная сторона"
                class="h-44 w-full rounded border border-[#eeeeee] object-cover"
              >
              <p v-else-if="loadingDocs">Загрузка...</p>
              <p v-else>Предпросмотр недоступен.</p>
            </div>
          </div>

          <div>
            <p class="mb-1 font-semibold">Фото госномера</p>
            <img
              v-if="docUrls.platePhoto"
              :src="docUrls.platePhoto"
              alt="Фото госномера"
              class="h-44 w-full rounded border border-[#eeeeee] object-cover"
            >
            <p v-else-if="loadingDocs">Загрузка...</p>
            <p v-else>Предпросмотр недоступен.</p>
          </div>

          <p v-if="docsError" class="text-red-600">{{ docsError }}</p>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
