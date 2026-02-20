type MotionLevel = 'full' | 'reduced' | 'minimal'

interface NavigatorWithHints extends Navigator {
  connection?: {
    saveData?: boolean
    effectiveType?: string
    addEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void
  }
  deviceMemory?: number
}

const resolveMotionLevel = (
  reducedMotion: boolean,
  connection?: NavigatorWithHints['connection'],
  cores = 4,
  memory = 4
): MotionLevel => {
  if (reducedMotion) {
    return 'minimal'
  }

  let score = 100

  if (connection?.saveData) {
    score -= 45
  }

  if (connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
    score -= 45
  } else if (connection?.effectiveType === '3g') {
    score -= 28
  }

  if (cores <= 2) {
    score -= 28
  } else if (cores <= 4) {
    score -= 15
  }

  if (memory <= 2) {
    score -= 26
  } else if (memory <= 4) {
    score -= 10
  }

  if (score <= 35) {
    return 'minimal'
  }

  if (score <= 68) {
    return 'reduced'
  }

  return 'full'
}

export const useMotionProfile = () => {
  const initialized = useState('motion-profile-initialized', () => false)
  const motionLevel = useState<MotionLevel>('motion-profile-level', () => 'full')
  const hasFinePointer = useState('motion-profile-fine-pointer', () => false)
  const canHover = useState('motion-profile-can-hover', () => false)

  if (import.meta.client && !initialized.value) {
    const nav = navigator as NavigatorWithHints
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerFineQuery = window.matchMedia('(pointer: fine)')
    const hoverQuery = window.matchMedia('(hover: hover)')

    const syncProfile = () => {
      motionLevel.value = resolveMotionLevel(
        reducedMotionQuery.matches,
        nav.connection,
        nav.hardwareConcurrency || 4,
        nav.deviceMemory || 4
      )
      hasFinePointer.value = pointerFineQuery.matches
      canHover.value = hoverQuery.matches
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
    if (motionLevel.value === 'reduced') {
      return 0.68
    }
    return 1
  })

  const staggerScale = computed(() => {
    if (motionLevel.value === 'minimal') {
      return 0
    }
    if (motionLevel.value === 'reduced') {
      return 0.55
    }
    return 1
  })

  const allowHolograms = computed(() => motionLevel.value !== 'minimal')
  const allowComplexMotion = computed(() => motionLevel.value === 'full')
  const allowCustomCursor = computed(
    () => allowComplexMotion.value && hasFinePointer.value && canHover.value
  )

  return {
    motionLevel: readonly(motionLevel),
    durationScale,
    staggerScale,
    allowHolograms,
    allowComplexMotion,
    allowCustomCursor
  }
}
