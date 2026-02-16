<script setup lang="ts">
import type { BookingStatus, Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const { fetchBookings } = useWarehouse()
const { bookingStatusLabel } = useRuLabels()

const loading = ref(false)
const rows = ref<any[]>([])
const notice = ref('')
const selected = ref<any | null>(null)
const detailsOpen = ref(false)
const loadingDocs = ref(false)
const docsError = ref('')
const docUrls = reactive({
  passportFront: '',
  passportBack: '',
  platePhoto: ''
})
const filters = ref({
  from: '',
  to: '',
  statuses: [] as BookingStatus[]
})

const approvingId = ref<string | null>(null)
const removingId = ref<string | null>(null)

const tableColumns = [
  { key: 'requested_datetime', label: 'Запрошено' },
  { key: 'status', label: 'Статус' },
  { key: 'driver_name', label: 'Водитель' },
  { key: 'car_plate_text', label: 'Номер' },
  { key: 'tenant', label: 'Арендатор' },
  { key: 'zone_id', label: 'Зона' },
  { key: 'actions', label: 'Действия' }
]

const refresh = async () => {
  loading.value = true
  rows.value = await fetchBookings({
    from: filters.value.from ? `${filters.value.from}T00:00:00` : undefined,
    to: filters.value.to ? `${filters.value.to}T23:59:59` : undefined,
    statuses: filters.value.statuses
  })
  loading.value = false
}

const approveBooking = async (row: any) => {
  approvingId.value = row.id
  const { error } = await supabase.from('bookings').update({ status: 'approved' }).eq('id', row.id)
  notice.value = error ? error.message : 'Бронирование одобрено.'
  approvingId.value = null
  await refresh()
}

const removeBooking = async (row: any) => {
  const ok = confirm('Удалить это бронирование? Действие нельзя отменить.')
  if (!ok) {
    return
  }

  removingId.value = row.id
  const { error } = await supabase.from('bookings').delete().eq('id', row.id)
  notice.value = error ? error.message : 'Бронирование удалено.'
  removingId.value = null
  await refresh()
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
  detailsOpen.value = true
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

watch(detailsOpen, (isOpen) => {
  if (isOpen) {
    return
  }

  docsError.value = ''
  docUrls.passportFront = ''
  docUrls.passportBack = ''
  docUrls.platePhoto = ''
})

onMounted(refresh)
watch(filters, refresh, { deep: true })
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold">Бронирования</h1>
      <p class="text-sm text-slate-500">Одобрение и удаление заявок арендаторов.</p>
    </div>

    <UAlert v-if="notice" :title="notice" color="primary" variant="subtle" />

    <BookingFilters v-model="filters" />

    <UCard>
      <div v-if="loading">
        <USkeleton class="h-40" />
      </div>
      <UTable
        v-else
        :rows="rows"
        :columns="tableColumns"
      >
        <template #requested_datetime-data="{ row }">
          {{ new Date(row.requested_datetime).toLocaleString() }}
        </template>
        <template #status-data="{ row }">
          <UBadge :label="bookingStatusLabel(row.status)" color="gray" variant="subtle" />
        </template>
        <template #tenant-data="{ row }">
          {{ row.profiles?.full_name || row.tenant_id }}
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton
              size="xs"
              label="Просмотр"
              variant="ghost"
              :disabled="approvingId === row.id || removingId === row.id"
              @click="showDetails(row)"
            />
            <UButton
              size="xs"
              label="Одобрить"
              :loading="approvingId === row.id"
              :disabled="row.status === 'approved' || removingId === row.id"
              @click="approveBooking(row)"
            />
            <UButton
              size="xs"
              label="Удалить"
              color="red"
              variant="outline"
              :loading="removingId === row.id"
              :disabled="approvingId === row.id"
              @click="removeBooking(row)"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="detailsOpen">
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
