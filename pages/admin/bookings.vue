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
const confirmOpen = ref(false)
const pendingAction = ref<{ type: 'approve' | 'reject'; row: any } | null>(null)
const rejectReason = ref('')
const rejectComment = ref('')
const rejectReasonOptions = [
  { label: 'Некорректные или неполные документы', value: 'docs' },
  { label: 'Заявка не соответствует регламенту', value: 'rules' },
  { label: 'Слот или данные уже не актуальны', value: 'slot' },
  { label: 'Другое', value: 'other' }
]

const driverDetailsTitle = '\u0414\u0430\u043d\u043d\u044b\u0435 \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f'

const tableColumns = [
  { key: 'id', label: 'id' },
  { key: 'tenant', label: 'arendator' },
  { key: 'requested_datetime', label: 'data' },
  { key: 'status', label: 'status' },
  { key: 'actions', label: 'actions' }
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

const rejectBooking = async (row: any, reasonNote: string) => {
  if (row.status === 'approved') {
    notice.value = 'Одобренную заявку нельзя отклонить.'
    return
  }

  removingId.value = row.id
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'rejected', admin_note: reasonNote })
    .eq('id', row.id)
  notice.value = error ? error.message : 'Заявка отклонена.'
  removingId.value = null
  await refresh()
}

const openApproveConfirm = (row: any) => {
  pendingAction.value = { type: 'approve', row }
  confirmOpen.value = true
}

const openRejectConfirm = (row: any) => {
  if (row.status === 'approved') {
    notice.value = 'Одобренную заявку нельзя отклонить.'
    return
  }
  rejectReason.value = ''
  rejectComment.value = ''
  pendingAction.value = { type: 'reject', row }
  confirmOpen.value = true
}

const confirmAction = async () => {
  if (!pendingAction.value) {
    return
  }

  if (pendingAction.value.type === 'approve') {
    const row = pendingAction.value.row
    pendingAction.value = null
    confirmOpen.value = false
    await approveBooking(row)
    return
  }

  const reasonLabel = rejectReasonOptions.find((item) => item.value === rejectReason.value)?.label || ''
  const comment = rejectComment.value.trim()

  if (!reasonLabel && !comment) {
    notice.value = 'Укажите причину отклонения.'
    return
  }

  const noteParts = []
  if (reasonLabel) {
    noteParts.push(`Причина: ${reasonLabel}`)
  }
  if (comment) {
    noteParts.push(`Комментарий: ${comment}`)
  }

  const row = pendingAction.value.row
  pendingAction.value = null
  confirmOpen.value = false
  await rejectBooking(row, noteParts.join('. '))
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

watch(confirmOpen, (isOpen) => {
  if (isOpen) {
    return
  }
  pendingAction.value = null
  rejectReason.value = ''
  rejectComment.value = ''
})

onMounted(refresh)
watch(filters, refresh, { deep: true })
</script>

<template>
  <div class="space-y-4 admin-page-content">
    <div>
      <h1 class="text-2xl font-semibold">Бронирования</h1>
      <p class="text-sm text-slate-500">Одобрение и отклонение заявок арендаторов.</p>
    </div>

    <UAlert v-if="notice" :title="notice" color="primary" variant="subtle" />

    <BookingFilters v-model="filters" />

    <UCard>
      <div v-if="loading">
        <USkeleton class="h-40" />
      </div>
      <UTable v-else :rows="rows" :columns="tableColumns">
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
              @click="openApproveConfirm(row)"
            />
            <UButton
              size="xs"
              label="Отклонить"
              color="red"
              variant="outline"
              :loading="removingId === row.id"
              :disabled="approvingId === row.id || row.status === 'approved' || row.status === 'rejected'"
              @click="openRejectConfirm(row)"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="confirmOpen">
      <UCard>
        <template #header>
          <p class="font-semibold">Подтверждение действия</p>
        </template>

        <div v-if="pendingAction?.type === 'approve'" class="space-y-3">
          <p class="text-sm text-slate-700">Вы точно хотите одобрить эту заявку?</p>
        </div>

        <div v-else class="space-y-3">
          <p class="text-sm text-slate-700">Вы точно хотите отклонить эту заявку?</p>
          <UFormGroup label="Причина отклонения">
            <USelectMenu
              v-model="rejectReason"
              :options="rejectReasonOptions"
              option-attribute="label"
              value-attribute="value"
              placeholder="Выберите причину"
            />
          </UFormGroup>
          <UFormGroup label="Комментарий (необязательно)">
            <UTextarea v-model="rejectComment" :rows="3" />
          </UFormGroup>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <UButton label="Отмена" type="button" variant="ghost" @click="confirmOpen = false" />
          <UButton
            label="Подтвердить"
            type="button"
            color="white"
            :loading="approvingId !== null || removingId !== null"
            @click="confirmAction"
          />
        </div>
      </UCard>
    </UModal>

    <UModal v-model="detailsOpen">
      <UCard>
        <template #header>
          <p class="font-semibold">{{ driverDetailsTitle }}</p>
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
