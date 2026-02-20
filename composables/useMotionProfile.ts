type MotionLevel = 'full' | 'reduced' | 'minimal'
type PerformanceTier = 'high' | 'medium' | 'low' | 'ultra'

interface NavigatorWithHints extends Navigator {
  connection?: {
    saveData?: boolean
    effectiveType?: string
    addEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void
  }
  deviceMemory?: number
}

const detectWebView = () => {
  if (!import.meta.client) {
    return false
  }

  const ua = navigator.userAgent || ''
  const hasFlutterBridge = typeof (window as any).flutter_inappwebview !== 'undefined'
  const hasReactNativeBridge = typeof (window as any).ReactNativeWebView !== 'undefined'

  const androidWebView =
    /Android/i.test(ua)
    && (/\bwv\b/i.test(ua) || /Version\/[\d.]+\s+Chrome\/[\d.]+\s+Mobile Safari\/[\d.]+/i.test(ua))

  const iosWebView =
    /iPhone|iPad|iPod/i.test(ua)
    && /AppleWebKit/i.test(ua)
    && !/Safari/i.test(ua)

  const likelyEmbeddedApp =
    /; wv\)|FBAN|FBAV|Instagram|Line\/|Telegram|TikTok|MiuiBrowser|YaBrowser/i.test(ua)

  return androidWebView || iosWebView || likelyEmbeddedApp || hasFlutterBridge || hasReactNativeBridge
}

const resolvePerformanceTier = (
  reducedMotion: boolean,
  isWebView: boolean,
  connection?: NavigatorWithHints['connection'],
  cores = 4,
  memory = 4
): PerformanceTier => {
  let score = 100

  if (reducedMotion) {
    score -= 75
  }

  if (isWebView) {
    score -= 35
  }

  if (connection?.saveData) {
    score -= 35
  }

  if (connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
    score -= 40
  } else if (connection?.effectiveType === '3g') {
    score -= 24
  }

  if (cores <= 2) {
    score -= 24
  } else if (cores <= 4) {
    score -= 15
  } else if (cores <= 6) {
    score -= 7
  }

  if (memory <= 2) {
    score -= 24
  } else if (memory <= 4) {
    score -= 15
  } else if (memory <= 6) {
    score -= 7
  }

  if (score <= 20) {
    return 'ultra'
  }
  if (score <= 52) {
    return 'low'
  }
  if (score <= 78) {
    return 'medium'
  }
  return 'high'
}

const resolveMotionLevel = (reducedMotion: boolean, tier: PerformanceTier): MotionLevel => {
  if (reducedMotion || tier === 'ultra') {
    return 'minimal'
  }
  if (tier === 'low' || tier === 'medium') {
    return 'reduced'
  }
  return 'full'
}

export const useMotionProfile = () => {
  const initialized = useState('motion-profile-initialized', () => false)
  const motionLevel = useState<MotionLevel>('motion-profile-level', () => 'reduced')
  const performanceTier = useState<PerformanceTier>('motion-profile-tier', () => 'medium')
  const isWebView = useState('motion-profile-webview', () => false)
  const hasFinePointer = useState('motion-profile-fine-pointer', () => false)
  const canHover = useState('motion-profile-can-hover', () => false)

  if (import.meta.client && !initialized.value) {
    const nav = navigator as NavigatorWithHints
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerFineQuery = window.matchMedia('(pointer: fine)')
    const hoverQuery = window.matchMedia('(hover: hover)')

    const syncProfile = () => {
      const webView = detectWebView()
      const tier = resolvePerformanceTier(
        reducedMotionQuery.matches,
        webView,
        nav.connection,
        nav.hardwareConcurrency || 4,
        nav.deviceMemory || 4
      )

      isWebView.value = webView
      performanceTier.value = tier
      motionLevel.value = resolveMotionLevel(reducedMotionQuery.matches, tier)
      hasFinePointer.value = pointerFineQuery.matches && !webView
      canHover.value = hoverQuery.matches && !webView
    }

    syncProfile()

    reducedMotionQuery.addEventListener?.('change', syncProfile)
    pointerFineQuery.addEventListener?.('change', syncProfile)
    hoverQuery.addEventListener?.('change', syncProfile)
    nav.connection?.addEventListener?.('change', syncProfile)

    initialized.value = true
  }

  const durationScale = computed(() => {
    if (motionLevel.value === 'minimal') {
      return 0
    }
    if (performanceTier.value === 'low') {
      return 0.32
    }
    if (motionLevel.value === 'reduced') {
      return 0.5
    }
    return 1
  })

  const staggerScale = computed(() => {
    if (motionLevel.value === 'minimal') {
      return 0
    }
    if (performanceTier.value === 'low') {
      return 0.24
    }
    if (motionLevel.value === 'reduced') {
      return 0.4
    }
    return 1
  })

  const allowHolograms = computed(
    () => performanceTier.value === 'high' && motionLevel.value === 'full' && !isWebView.value
  )
  const allowBackdropFx = computed(
    () => performanceTier.value === 'high' && motionLevel.value === 'full' && !isWebView.value
  )
  const allowGlassFx = computed(() => performanceTier.value !== 'ultra' && !isWebView.value)
  const allowComplexMotion = computed(
    () => performanceTier.value === 'high' && motionLevel.value === 'full' && !isWebView.value
  )
  const allowChartAnimation = computed(
    () => performanceTier.value === 'high' && motionLevel.value !== 'minimal' && !isWebView.value
  )
  const allowCustomCursor = computed(
    () => allowComplexMotion.value && hasFinePointer.value && canHover.value
  )

  return {
    motionLevel: readonly(motionLevel),
    performanceTier: readonly(performanceTier),
    isWebView: readonly(isWebView),
    durationScale,
    staggerScale,
    allowHolograms,
    allowBackdropFx,
    allowGlassFx,
    allowComplexMotion,
    allowChartAnimation,
    allowCustomCursor
  }
}
