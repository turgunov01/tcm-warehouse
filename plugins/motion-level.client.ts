export default defineNuxtPlugin(() => {
  const { motionLevel } = useMotionProfile()

  watchEffect(() => {
    document.documentElement.dataset.motionLevel = motionLevel.value
  })
})
