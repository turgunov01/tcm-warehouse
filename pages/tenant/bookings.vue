<script setup lang="ts">
import type { BookingStatus, Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { fetchBookings, fetchSettings } = useWarehouse()
const { profile, loadProfile } = useAuthRbac()
type UploadField = 'driver_passport_front' | 'driver_passport_back' | 'car_plate_photo'
type SlotOption = { label: string; value: string; disabled?: boolean }

const bookings = ref<any[]>([])
const viewMode = ref<'table' | 'calendar'>('table')
const filters = ref({
  from: '',
  to: '',
  statuses: [] as BookingStatus[]
})

const isCreateOpen = ref(false)
const loading = ref(false)
const formNotice = ref('')
const settings = ref<any>(null)
const bookedSlotValues = ref<string[]>([])

const form = reactive({
  driver_name: '',
  car_plate_text: '',
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

  for (let cursor = startMinutes; cursor <= endMinutes; cursor += 30) {
    const minutesInDay = cursor
    const slotDate = new Date(targetDate)
    slotDate.setHours(Math.floor(minutesInDay / 60), minutesInDay % 60, 0, 0)

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

const createBooking = async () => {
  if (!form.requested_datetime) {
    formNotice.value = 'Выберите свободный слот даты и времени.'
    return
  }
  if (freeSlotOptions.value.find((slot) => slot.value === form.requested_datetime)?.disabled) {
    formNotice.value = 'Выбранный слот уже занят. Пожалуйста, выберите другой.'
    return
  }

  if (!form.driver_passport_front || !form.driver_passport_back || !form.car_plate_photo) {
    formNotice.value = 'Нужно загрузить все документы.'
    return
  }

  loading.value = true
  formNotice.value = ''

  try {
    const [front, back, platePhoto] = await Promise.all([
      uploadFile(form.driver_passport_front),
      uploadFile(form.driver_passport_back),
      uploadFile(form.car_plate_photo)
    ])

    const { error } = await supabase.from('bookings').insert({
      driver_name: form.driver_name,
      driver_passport_front: front,
      driver_passport_back: back,
      car_plate_photo: platePhoto,
      car_plate_text: form.car_plate_text,
      requested_datetime: form.requested_datetime,
      is_express: form.is_express
    })

    if (error) {
      formNotice.value = error.message
      loading.value = false
      return
    }

    formNotice.value = 'Бронирование создано.'
    isCreateOpen.value = false
    form.driver_name = ''
    form.car_plate_text = ''
    form.requested_datetime = ''
    form.is_express = false
    form.driver_passport_front = null
    form.driver_passport_back = null
    form.car_plate_photo = null
    await load()
  } catch (error: any) {
    formNotice.value = error?.message || 'Не удалось создать бронирование'
  } finally {
    loading.value = false
  }
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
      <UButton label="Создать бронирование" color="white" @click="isCreateOpen = true" />
    </div>

    <BookingFilters v-model="filters" />

    <UCard>
      <div class="flex justify-end">
        <UButtonGroup>
          <UButton label="Таблица" :variant="viewMode === 'table' ? 'solid' : 'outline'" @click="viewMode = 'table'" />
          <UButton label="Календарь" :variant="viewMode === 'calendar' ? 'solid' : 'outline'" @click="viewMode = 'calendar'" />
        </UButtonGroup>
      </div>
    </UCard>

    <BookingTable v-if="viewMode === 'table'" :rows="bookings" />
    <BookingCalendar v-else :rows="bookings" />

    <UModal v-model="isCreateOpen">
      <UCard>
        <template #header>
          <p class="font-semibold">Новое бронирование</p>
        </template>

        <UForm :state="form" class="space-y-3" @submit.prevent="createBooking">
          <UFormGroup label="Имя водителя"><UInput v-model="form.driver_name" required /></UFormGroup>
          <UFormGroup label="Номер машины"><UInput v-model="form.car_plate_text" required /></UFormGroup>
          <UFormGroup label="Желаемая дата и время">
            <USelectMenu
              v-model="form.requested_datetime"
              :options="freeSlotOptions"
              option-attribute="label"
              value-attribute="value"
              :disabled="!hasAvailableSlots"
              :searchable="false"
              placeholder="Нет свободных слотов"
              required
            />
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

          <p v-if="formNotice" class="text-sm text-slate-600">{{ formNotice }}</p>

          <div class="flex justify-end gap-2">
            <UButton label="Отмена" variant="ghost" @click="isCreateOpen = false" />
            <UButton type="submit" label="Отправить" color="white" :loading="loading" />
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>


