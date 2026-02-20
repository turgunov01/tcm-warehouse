<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  title: string
  labels: string[]
  values: number[]
}>()
const { motionLevel, durationScale, allowChartAnimation } = useMotionProfile()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: ['#d7b56a', '#678fcb', '#36a897', '#b27be8', '#f08b55']
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#c6d0e1'
      }
    },
    tooltip: {
      backgroundColor: '#111722',
      borderColor: 'rgba(255,255,255,0.16)',
      borderWidth: 1,
      titleColor: '#f8fafc',
      bodyColor: '#e2e8f0'
    }
  },
  animation:
    !allowChartAnimation.value || motionLevel.value === 'minimal'
      ? false
      : {
          duration: Math.max(120, Math.round(650 * durationScale.value))
        }
}))

const wrapper = ref<HTMLElement | null>(null)
const { animateIn } = useGsap()

onMounted(async () => {
  if (wrapper.value) {
    await animateIn(wrapper.value, { duration: 0.45, y: 10 })
  }
})
</script>

<template>
  <UCard ref="wrapper" class="kinetic-panel kinetic-panel-delay-a">
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
