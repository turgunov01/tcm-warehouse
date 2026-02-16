<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  title: string
  labels: string[]
  values: number[]
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1']
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  },
  animation: {
    duration: 650
  }
}

const wrapper = ref<HTMLElement | null>(null)
const { animateIn } = useGsap()

onMounted(async () => {
  if (wrapper.value) {
    await animateIn(wrapper.value, { duration: 0.45, y: 10 })
  }
})
</script>

<template>
  <UCard ref="wrapper">
    <template #header>
      <p class="font-semibold">{{ title }}</p>
    </template>
    <ClientOnly>
      <div class="h-72">
        <Pie :data="chartData" :options="chartOptions" />
      </div>
    </ClientOnly>
  </UCard>
</template>
