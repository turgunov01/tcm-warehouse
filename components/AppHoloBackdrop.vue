<script setup lang="ts">
const root = ref<HTMLElement | null>(null)
const { allowHolograms, allowComplexMotion, motionLevel } = useMotionProfile()

const target = { x: 0, y: 0 }
const current = { x: 0, y: 0 }
let rafId = 0
let listening = false

const applyVars = () => {
  if (!root.value) {
    return
  }
  root.value.style.setProperty('--mx', `${current.x.toFixed(2)}px`)
  root.value.style.setProperty('--my', `${current.y.toFixed(2)}px`)
}

const render = () => {
  current.x += (target.x - current.x) * 0.06
  current.y += (target.y - current.y) * 0.06
  applyVars()
  rafId = window.requestAnimationFrame(render)
}

const handleMove = (event: PointerEvent) => {
  const xNorm = event.clientX / window.innerWidth - 0.5
  const yNorm = event.clientY / window.innerHeight - 0.5
  target.x = xNorm * 46
  target.y = yNorm * 36
}

const handleLeave = () => {
  target.x = 0
  target.y = 0
}

const stopMotionLayer = () => {
  if (!import.meta.client) {
    return
  }
  if (listening) {
    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerleave', handleLeave)
    window.removeEventListener('blur', handleLeave)
    listening = false
  }
  if (rafId) {
    window.cancelAnimationFrame(rafId)
    rafId = 0
  }
  target.x = 0
  target.y = 0
  current.x = 0
  current.y = 0
  applyVars()
}

const startMotionLayer = () => {
  if (!import.meta.client) {
    return
  }
  stopMotionLayer()
  if (!allowComplexMotion.value || !allowHolograms.value) {
    return
  }
  window.addEventListener('pointermove', handleMove, { passive: true })
  window.addEventListener('pointerleave', handleLeave)
  window.addEventListener('blur', handleLeave)
  listening = true
  rafId = window.requestAnimationFrame(render)
}

watch(
  () => [allowComplexMotion.value, allowHolograms.value, motionLevel.value],
  () => {
    if (allowComplexMotion.value && allowHolograms.value) {
      startMotionLayer()
      return
    }
    stopMotionLayer()
  },
  { immediate: true }
)

onMounted(() => {
  applyVars()
})

onBeforeUnmount(() => {
  stopMotionLayer()
})
</script>

<template>
  <div v-if="allowHolograms" ref="root" class="app-holo-backdrop" aria-hidden="true">
    <div class="app-holo-noise" />
    <div class="app-holo-aurora app-holo-aurora-a" />
    <div class="app-holo-aurora app-holo-aurora-b" />
    <div class="app-holo-lens app-holo-lens-a" />
    <div class="app-holo-lens app-holo-lens-b" />
    <div class="app-holo-grid" />
    <div class="app-holo-shimmer" />
  </div>
</template>
