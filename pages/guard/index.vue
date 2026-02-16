<script setup lang="ts">
import type { Database } from '~/types/database'

const supabase = useSupabaseClient<Database>()
const { user } = useAuthRbac()
const selectedZone = useState<string | null>('guard-zone', () => null)
const zones = ref<Database['public']['Tables']['zones']['Row'][]>([])

const load = async () => {
  const { data } = await supabase.from('zones').select('*').order('name')
  zones.value = data ?? []
}

const chooseZone = async (id: string) => {
  selectedZone.value = id
  if (user.value) {
    await supabase.from('profiles').update({ zone_id: id }).eq('id', user.value.id)
  }
  navigateTo('/guard/bookings')
}

onMounted(load)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold">Выбор зоны охраны</h1>
      <p class="text-sm text-slate-500">Выберите зону для контроля очереди на сегодня.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <UCard v-for="zone in zones" :key="zone.id">
        <div class="space-y-3">
          <p class="text-lg font-semibold">{{ zone.name }}</p>
          <p class="text-sm text-slate-500">{{ zone.description || 'Без описания' }}</p>
          <UButton label="Выбрать зону" color="white" block @click="chooseZone(zone.id)" />
        </div>
      </UCard>
    </div>
  </div>
</template>
