<script setup lang="ts">
const dot = ref<HTMLElement | null>(null)
const halo = ref<HTMLElement | null>(null)
const enabled = ref(false)
const visible = ref(false)
const { allowCustomCursor } = useMotionProfile()

let rafId = 0
let clickBoost = 0
const current = { x: 0, y: 0 }
const target = { x: 0, y: 0 }

const syncOpacity = () => {
  const opacity = enabled.value && visible.value ? '1' : '0'
  if (dot.value) {
    dot.value.style.opacity = opacity
  }
  if (halo.value) {
    halo.value.style.opacity = opacity
  }
}

const render = () => {
  current.x += (target.x - current.x) * 0.22
  current.y += (target.y - current.y) * 0.22
  clickBoost *= 0.82

  if (dot.value) {
    const dotScale = 1 + clickBoost * 0.16
    dot.value.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(${dotScale})`
  }

  if (halo.value) {
    const haloScale = 1 + clickBoost
    halo.value.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(${haloScale})`
  }

  rafId = window.requestAnimationFrame(render)
}

const handleMove = (event: PointerEvent) => {
  target.x = event.clientX
  target.y = event.clientY
  if (!visible.value) {
    current.x = target.x
    current.y = target.y
    visible.value = true
    syncOpacity()
  }
}

const handleClickPulse = () => {
  clickBoost = 0.55
}

const handlePointerLeave = () => {
  visible.value = false
  syncOpacity()
}

const removeListeners = () => {
  window.removeEventListener('pointermove', handleMove)
  window.removeEventListener('pointerdown', handleClickPulse)
  window.removeEventListener('pointerup', handleClickPulse)
  window.removeEventListener('blur', handlePointerLeave)
  document.removeEventListener('mouseleave', handlePointerLeave)
}

const disableCursor = () => {
  enabled.value = false
  visible.value = false
  syncOpacity()
  removeListeners()
  document.documentElement.classList.remove('custom-cursor-enabled')
  if (rafId) {
    window.cancelAnimationFrame(rafId)
    rafId = 0
  }
}

const enableCursor = () => {
  if (!allowCustomCursor.value) {
    disableCursor()
    return
  }

  removeListeners()
  document.documentElement.classList.add('custom-cursor-enabled')
  enabled.value = true
  syncOpacity()

  window.addEventListener('pointermove', handleMove, { passive: true })
  window.addEventListener('pointerdown', handleClickPulse, { passive: true })
  window.addEventListener('pointerup', handleClickPulse, { passive: true })
  window.addEventListener('blur', handlePointerLeave)
  document.addEventListener('mouseleave', handlePointerLeave)

  if (!rafId) {
    rafId = window.requestAnimationFrame(render)
  }
}

watch(
  allowCustomCursor,
  (next) => {
    if (!import.meta.client) {
      return
    }

    if (next) {
      enableCursor()
      return
    }

    disableCursor()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }
  disableCursor()
})
</script>

<template>
  <Teleport to="body">
    <div ref="halo" class="pulse-cursor-halo" aria-hidden="true" />
    <div ref="dot" class="pulse-cursor-dot" aria-hidden="true" />
  </Teleport>
</template>
