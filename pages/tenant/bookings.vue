<script setup lang="ts">
import type { BookingStatus, Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { fetchBookings, fetchSettings } = useWarehouse()
const { profile, loadProfile } = useAuthRbac()
type UploadField = 'driver_passport_front' | 'driver_passport_back' | 'car_plate_photo'
type SlotOption = { label: string; value: string; disabled?: boolean }
type CarFuelType = 'gas' | 'petrol'
type OperationType = 'inbound' | 'outbound' | 'inbound_outbound'
type ClosureRow = Pick<Database['public']['Tables']['closures']['Row'], 'reason' | 'starts_at' | 'ends_at' | 'zone_id'>

const bookings = ref<any[]>([])
const viewMode = ref<'table' | 'calendar'>('table')
const filters = ref({
  from: '',
  to: '',
  statuses: [] as BookingStatus[]
})

const isCreateOpen = ref(false)
const isTermsOpen = ref(false)
const isClosureBlockedOpen = ref(false)
const skipCreateCloseConfirm = ref(false)
const skipTermsCloseConfirm = ref(false)
const closeConfirmOpen = ref(false)
const checkingCreateAvailability = ref(false)
const loading = ref(false)
const formNotice = ref('')
const closureNotice = ref('')
const settings = ref<any>(null)
const bookedSlotValues = ref<string[]>([])
const fuelTypeOptions: { label: string; value: CarFuelType }[] = [
  { label: 'Газ', value: 'gas' },
  { label: 'Бензин', value: 'petrol' }
]
const operationTypeOptions: { label: string; value: OperationType }[] = [
  { label: 'Ввоз', value: 'inbound' },
  { label: 'Вывоз', value: 'outbound' },
  { label: 'Ввоз и вывоз', value: 'inbound_outbound' }
]

const form = reactive({
  driver_name: '',
  car_plate_text: '',
  car_fuel_type: '' as '' | CarFuelType,
  operation_type: '' as '' | OperationType,
  requested_datetime: '',
  is_express: false,
  driver_passport_front: null as File | null,
  driver_passport_back: null as File | null,
  car_plate_photo: null as File | null
})

const pad2 = (value: number) => String(value).padStart(2, '0')

const toDatetimeLocalValue = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`

const formatSlotLabel = (date: Date) =>
  date.toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

const toDateKey = (date: Date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`

const buildFreeSlotOptions = (targetDate: Date): SlotOption[] => {
  const startMinutes = 0
  const endMinutes = 19 * 60
  const slots: SlotOption[] = []
  const now = new Date()
  const isToday =
    targetDate.getFullYear() === now.getFullYear()
    && targetDate.getMonth() === now.getMonth()
    && targetDate.getDate() === now.getDate()

  for (let cursor = startMinutes; cursor <= endMinutes; cursor += 30) {
    const minutesInDay = cursor
    const slotDate = new Date(targetDate)
    slotDate.setHours(Math.floor(minutesInDay / 60), minutesInDay % 60, 0, 0)

    if (isToday && slotDate < now) {
      continue
    }

    slots.push({
      label: formatSlotLabel(slotDate),
      value: toDatetimeLocalValue(slotDate)
    })
  }

  return slots
}

const requestedBaseDate = computed(() => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  if (!form.is_express) {
    date.setDate(date.getDate() + 1)
  }
  return date
})

const freeSlotOptions = computed(() => {
  const booked = new Set(bookedSlotValues.value)
  return buildFreeSlotOptions(requestedBaseDate.value).map((slot) => ({
    ...slot,
    disabled: booked.has(slot.value)
  }))
})
const hasAvailableSlots = computed(() => freeSlotOptions.value.some((slot) => !slot.disabled))
const selectedSlotLabel = computed(() => freeSlotOptions.value.find((slot) => slot.value === form.requested_datetime)?.label || '')
const closeConfirmText = computed(() => {
  if (isTermsOpen.value) {
    return 'Закрыть оформление заявки? Все заполненные данные и выбранные документы будут потеряны.'
  }
  return 'Закрыть окно создания заявки? Несохраненные данные будут потеряны.'
})

const onFileChange = (field: UploadField, payload: Event | FileList | File[] | null | undefined) => {
  let file: File | null = null

  if (payload instanceof FileList) {
    file = payload.item(0)
  } else if (Array.isArray(payload)) {
    file = payload[0] ?? null
  } else if (payload && typeof payload === 'object' && 'target' in payload) {
    file = (payload.target as HTMLInputElement | null)?.files?.[0] ?? null
  }

  form[field] = file
}

const loadBookedSlots = async () => {
  const dateKey = toDateKey(requestedBaseDate.value)
  let query = supabase
    .from('bookings')
    .select('requested_datetime, status, zone_id')
    .gte('requested_datetime', `${dateKey}T00:00:00`)
    .lte('requested_datetime', `${dateKey}T23:59:59`)
    .in('status', ['pending', 'approved', 'arrived', 'left', 'completed'])

  if (profile.value?.zone_id) {
    query = query.eq('zone_id', profile.value.zone_id)
  }

  const { data, error } = await query
  if (error) {
    bookedSlotValues.value = []
    return
  }

  bookedSlotValues.value = Array.from(
    new Set((data ?? []).map((row) => toDatetimeLocalValue(new Date(row.requested_datetime))))
  )
}

const uploadFile = async (file: File) => {
  if (!user.value) {
    throw new Error('Пользователь не найден')
  }
  const ext = file.name.split('.').pop() || 'bin'
  const path = `${user.value.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('documents').upload(path, file, { upsert: true })
  if (error) {
    throw error
  }
  return path
}

const estimatedExpress = computed(() => Number(settings.value?.hourly_penalty || 0))

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

const mapBookingErrorMessage = (raw: string) => {
  const message = raw.trim()
  const dictionary: Record<string, string> = {
    'Selected time is closed by force majeure closure': 'Выбранное время закрыто из-за форс-мажора.',
    'Today booking requires express mode': 'Для бронирования на сегодня нужно включить экспресс-режим.',
    'Bookings are limited to tomorrow; today only allowed as express': 'Обычное бронирование доступно только на завтра. На сегодня можно только экспресс.',
    'Booking is not allowed during break window': 'На это время установлен перерыв, слот недоступен.',
    'Controlled window allows only one booking per 30-minute slot per zone': 'Этот 30-минутный слот уже занят в вашей зоне.',
    'Tenant reached max 2 bookings per day': 'Достигнут лимит: не более 2 заявок в день.',
    'Tenant reached max 2 bookings per day in this zone': 'Достигнут лимит: не более 2 заявок в день в этой зоне.',
    'Booking blocked because debt exceeded configured threshold': 'Создание заявки заблокировано из-за превышения лимита задолженности.',
    'Tenant must be assigned to a zone': 'Профиль арендатора не привязан к зоне. Обратитесь к администратору.'
  }

  return dictionary[message] || message
}

const extractRequestErrorMessage = (error: any, fallback = 'Не удалось создать бронирование') => {
  const base =
    error?.message
    || error?.data?.statusMessage
    || error?.data?.message
    || error?.error_description
    || fallback

  const details = typeof error?.details === 'string' ? error.details.trim() : ''
  const hint = typeof error?.hint === 'string' ? error.hint.trim() : ''
  let full = mapBookingErrorMessage(base)

  if (details && !full.includes(details)) {
    full += ` (${details})`
  }

  if (hint && !full.includes(hint)) {
    full += ` Подсказка: ${hint}`
  }

  return full
}

const openCreateBooking = async () => {
  checkingCreateAvailability.value = true
  closureNotice.value = ''
  formNotice.value = ''

  try {
    if (!profile.value) {
      await loadProfile()
    }

    const nowIso = new Date().toISOString()
    let query = supabase
      .from('closures')
      .select('reason, starts_at, ends_at, zone_id')
      .eq('is_active', true)
      .lte('starts_at', nowIso)
      .gte('ends_at', nowIso)
      .order('starts_at', { ascending: false })
      .limit(1)

    if (profile.value?.zone_id) {
      query = query.or(`zone_id.is.null,zone_id.eq.${profile.value.zone_id}`)
    } else {
      query = query.is('zone_id', null)
    }

    const { data, error } = await query
    if (error) {
      closureNotice.value = 'Не удалось проверить статус склада. Попробуйте еще раз.'
      isClosureBlockedOpen.value = true
      return
    }

    const closure = (data?.[0] as ClosureRow | undefined) || null
    if (closure) {
      const from = formatDateTime(closure.starts_at)
      const to = formatDateTime(closure.ends_at)
      const reasonPart = closure.reason ? ` Причина: ${closure.reason}.` : ''
      closureNotice.value = `Selected time is closed by force majeure closure. Склад временно закрыт с ${from} до ${to}.${reasonPart}`
      isClosureBlockedOpen.value = true
      return
    }

    isCreateOpen.value = true
  } finally {
    checkingCreateAvailability.value = false
  }
}

const validateForm = () => {
  if (!form.car_fuel_type) {
    formNotice.value = 'Укажите тип машины: газ или бензин.'
    return false
  }

  if (!form.operation_type) {
    formNotice.value = 'Укажите тип операции: ввоз, вывоз или ввоз и вывоз.'
    return false
  }

  if (!form.requested_datetime) {
    formNotice.value = 'Выберите свободный слот даты и времени.'
    return false
  }

  if (freeSlotOptions.value.find((slot) => slot.value === form.requested_datetime)?.disabled) {
    formNotice.value = 'Выбранный слот уже занят. Пожалуйста, выберите другой.'
    return false
  }

  if (!form.driver_passport_front || !form.driver_passport_back || !form.car_plate_photo) {
    formNotice.value = 'Нужно загрузить все документы.'
    return false
  }

  formNotice.value = ''
  return true
}

const closeTermsDirect = () => {
  skipTermsCloseConfirm.value = true
  isTermsOpen.value = false
}

const closeBookingFlowDirect = () => {
  skipTermsCloseConfirm.value = true
  skipCreateCloseConfirm.value = true
  isTermsOpen.value = false
  isCreateOpen.value = false
  closeConfirmOpen.value = false
}

const requestCloseFlowConfirm = () => {
  if (loading.value) {
    return
  }
  closeConfirmOpen.value = true
}

const handleCreateModalUpdate = (next: boolean) => {
  if (next) {
    isCreateOpen.value = true
    return
  }
  if (skipCreateCloseConfirm.value) {
    skipCreateCloseConfirm.value = false
    isCreateOpen.value = false
    return
  }
  requestCloseFlowConfirm()
}

const handleTermsModalUpdate = (next: boolean) => {
  if (next) {
    isTermsOpen.value = true
    return
  }
  if (skipTermsCloseConfirm.value) {
    skipTermsCloseConfirm.value = false
    isTermsOpen.value = false
    return
  }
  requestCloseFlowConfirm()
}

const openTermsModal = () => {
  if (!validateForm()) {
    return
  }
  isTermsOpen.value = true
}

const resetForm = () => {
  form.driver_name = ''
  form.car_plate_text = ''
  form.car_fuel_type = ''
  form.operation_type = ''
  form.requested_datetime = ''
  form.is_express = false
  form.driver_passport_front = null
  form.driver_passport_back = null
  form.car_plate_photo = null
}

const createBooking = async () => {
  if (!validateForm()) {
    return false
  }

  loading.value = true

  try {
    const passportFrontFile = form.driver_passport_front as File
    const passportBackFile = form.driver_passport_back as File
    const platePhotoFile = form.car_plate_photo as File
    const carFuelType = form.car_fuel_type as CarFuelType
    const operationType = form.operation_type as OperationType

    const [front, back, platePhoto] = await Promise.all([
      uploadFile(passportFrontFile),
      uploadFile(passportBackFile),
      uploadFile(platePhotoFile)
    ])

    const payload: Database['public']['Tables']['bookings']['Insert'] = {
      driver_name: form.driver_name,
      driver_passport_front: front,
      driver_passport_back: back,
      car_plate_photo: platePhoto,
      car_plate_text: form.car_plate_text,
      car_fuel_type: carFuelType,
      operation_type: operationType,
      requested_datetime: form.requested_datetime,
      is_express: form.is_express
    }

    const { error } = await supabase.from('bookings').insert(payload)

    if (error) {
      formNotice.value = extractRequestErrorMessage(error)
      return false
    }

    formNotice.value = ''
    return true
  } catch (error: any) {
    formNotice.value = extractRequestErrorMessage(error)
    return false
  } finally {
    loading.value = false
  }
}

const confirmTermsAndCreate = async () => {
  const success = await createBooking()
  if (!success) {
    return
  }

  closeBookingFlowDirect()
  formNotice.value = 'Бронирование создано.'
  resetForm()
  await load()
}

const load = async () => {
  if (!user.value?.id) {
    bookings.value = []
    return
  }

  bookings.value = await fetchBookings({
    from: filters.value.from ? `${filters.value.from}T00:00:00` : undefined,
    to: filters.value.to ? `${filters.value.to}T23:59:59` : undefined,
    statuses: filters.value.statuses,
    tenantIds: [user.value.id]
  })
}

onMounted(async () => {
  await loadProfile()
  settings.value = await fetchSettings()
  await load()
})

watch(filters, load, { deep: true })

watch(
  () => user.value?.id,
  () => {
    load()
  }
)

watch(
  freeSlotOptions,
  (options) => {
    const current = options.find((slot) => slot.value === form.requested_datetime)
    if (!current || current.disabled) {
      const firstAvailable = options.find((slot) => !slot.disabled)
      form.requested_datetime = firstAvailable?.value || ''
    }
  },
  { immediate: true }
)

watch(
  [requestedBaseDate, isCreateOpen, () => profile.value?.zone_id],
  async ([, modalOpen]) => {
    if (!modalOpen) {
      return
    }
    await loadBookedSlots()
  },
  { immediate: true }
)
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold">Бронирования</h1>
        <p class="text-sm text-slate-500">Создание и отслеживание бронирований по зоне.</p>
      </div>
      <UButton class="kinetic-btn" label="Создать бронирование" color="white" :loading="checkingCreateAvailability" @click="openCreateBooking" />
    </div>

    <BookingFilters v-model="filters" />

    <UCard>
      <div class="flex justify-end">
        <UButtonGroup>
            <UButton class="kinetic-btn" label="Таблица" :variant="viewMode === 'table' ? 'solid' : 'outline'" @click="viewMode = 'table'" />
            <UButton class="kinetic-btn" label="Календарь" :variant="viewMode === 'calendar' ? 'solid' : 'outline'" @click="viewMode = 'calendar'" />
        </UButtonGroup>
      </div>
    </UCard>

    <BookingTable v-if="viewMode === 'table'" :rows="bookings" />
    <BookingCalendar v-else :rows="bookings" />

    <UModal :model-value="isCreateOpen" :prevent-close="loading" @update:model-value="handleCreateModalUpdate">
      <UCard>
        <template #header>
          <p class="font-semibold">Новое бронирование</p>
        </template>

        <UForm :state="form" class="space-y-3" @submit.prevent="openTermsModal">
          <UFormGroup label="Имя водителя"><UInput v-model="form.driver_name" required /></UFormGroup>
          <UFormGroup label="Номер машины"><UInput v-model="form.car_plate_text" required /></UFormGroup>
          <UFormGroup label="Тип машины">
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="option in fuelTypeOptions"
                :key="option.value"
                :label="option.label"
                type="button"
                :variant="form.car_fuel_type === option.value ? 'solid' : 'outline'"
                :color="form.car_fuel_type === option.value ? 'primary' : 'gray'"
                @click="form.car_fuel_type = option.value"
              />
            </div>
          </UFormGroup>
          <UFormGroup label="Тип операции">
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="option in operationTypeOptions"
                :key="option.value"
                :label="option.label"
                type="button"
                :variant="form.operation_type === option.value ? 'solid' : 'outline'"
                :color="form.operation_type === option.value ? 'primary' : 'gray'"
                @click="form.operation_type = option.value"
              />
            </div>
          </UFormGroup>
          <UFormGroup label="Желаемая дата и время">
            <div v-if="hasAvailableSlots" class="space-y-2">
              <p v-if="selectedSlotLabel" class="text-xs text-slate-500">Выбранный слот: {{ selectedSlotLabel }}</p>
              <div class="max-h-52 overflow-y-auto rounded-md border border-slate-200 p-2">
                <div class="grid gap-2 sm:grid-cols-2">
                  <UButton
                    v-for="slot in freeSlotOptions"
                    :key="slot.value"
                    :label="slot.label"
                    type="button"
                    :variant="form.requested_datetime === slot.value ? 'solid' : 'outline'"
                    :color="form.requested_datetime === slot.value ? 'primary' : 'gray'"
                    :disabled="slot.disabled"
                    block
                    @click="form.requested_datetime = slot.value"
                  />
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-slate-500">Нет свободных слотов</p>
          </UFormGroup>

          <UCheckbox v-model="form.is_express" label="Экспресс-бронирование (обязательно для заявок на сегодня)" />
          <p class="text-xs text-slate-500">Оценочная стоимость экспресса: {{ estimatedExpress }}</p>

          <UFormGroup label="Паспорт (лицевая сторона)">
            <UInput type="file" accept="image/*" required @change="(payload) => onFileChange('driver_passport_front', payload)" />
          </UFormGroup>
          <UFormGroup label="Паспорт (обратная сторона)">
            <UInput type="file" accept="image/*" required @change="(payload) => onFileChange('driver_passport_back', payload)" />
          </UFormGroup>
          <UFormGroup label="Фото госномера">
            <UInput type="file" accept="image/*" required @change="(payload) => onFileChange('car_plate_photo', payload)" />
          </UFormGroup>

          <p v-if="formNotice" class="text-sm text-rose-400">{{ formNotice }}</p>

          <div class="flex justify-end gap-2">
            <UButton class="kinetic-btn" label="Отмена" type="button" variant="ghost" :disabled="loading" @click="closeBookingFlowDirect" />
            <UButton class="kinetic-btn" type="submit" label="Отправить" color="white" :loading="loading" />
          </div>
        </UForm>
      </UCard>
    </UModal>

    <UModal :model-value="isTermsOpen" :prevent-close="loading" @update:model-value="handleTermsModalUpdate">
      <UCard>
        <template #header>
          <p class="font-semibold">Условия подачи заявки</p>
        </template>
        <ul class="list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Заявки проверяются ежедневно с 10:00 до 18:00.</li>
          <li>Все сотрудники и ответственные лица должны иметь действующие пропуски и паспорт.</li>
          <li>Одна заявка оформляется только на одну машину.</li>
          <li>Просим не указывать к ввозу товары и вещества, запрещенные законодательством, включая наркотические.</li>
        </ul>
        <p v-if="formNotice" class="mt-3 text-sm text-rose-400">{{ formNotice }}</p>
        <div class="mt-4 flex justify-end gap-2">
          <UButton class="kinetic-btn" label="Назад" type="button" variant="ghost" :disabled="loading" @click="closeTermsDirect" />
          <UButton class="kinetic-btn" label="Согласен, отправить" type="button" color="white" :loading="loading" @click="confirmTermsAndCreate" />
        </div>
      </UCard>
    </UModal>

    <UModal v-model="closeConfirmOpen" :prevent-close="loading">
      <UCard class="glass-panel">
        <template #header>
          <p class="font-semibold">Подтвердите закрытие</p>
        </template>
        <p class="text-sm text-slate-300">{{ closeConfirmText }}</p>
        <div class="mt-4 flex justify-end gap-2">
          <UButton class="kinetic-btn" label="Продолжить заполнение" type="button" variant="ghost" @click="closeConfirmOpen = false" />
          <UButton class="kinetic-btn" label="Закрыть окно" type="button" color="red" @click="closeBookingFlowDirect" />
        </div>
      </UCard>
    </UModal>

    <UModal v-model="isClosureBlockedOpen">
      <UCard>
        <template #header>
          <p class="font-semibold">Создание заявки недоступно</p>
        </template>
        <p class="text-sm text-slate-700">{{ closureNotice }}</p>
        <div class="mt-4 flex justify-end">
          <UButton label="Понятно" type="button" color="white" @click="isClosureBlockedOpen = false" />
        </div>
      </UCard>
    </UModal>
  </div>
</template>


