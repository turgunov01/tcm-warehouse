export default defineNuxtPlugin(() => {
  const { motionLevel, performanceTier, isWebView, allowGlassFx } = useMotionProfile()

  watchEffect(() => {
    const root = document.documentElement
    root.dataset.motionLevel = motionLevel.value
    root.dataset.performanceTier = performanceTier.value
    root.dataset.webview = isWebView.value ? '1' : '0'
    root.dataset.glassFx = allowGlassFx.value ? '1' : '0'
  })
})
