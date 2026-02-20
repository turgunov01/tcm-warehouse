interface AnimateInOptions {
  duration?: number
  y?: number
  x?: number
  opacity?: number
  delay?: number
  ease?: string
}

interface StaggerOptions {
  duration?: number
  stagger?: number
  y?: number
  opacity?: number
  ease?: string
}

const getEl = (target: HTMLElement | string) => {
  if (typeof target === 'string') {
    return document.querySelector(target) as HTMLElement | null
  }
  return target
}

export const useGsap = () => {
  const { motionLevel, durationScale, staggerScale } = useMotionProfile()

  const getGsap = async () => {
    if (import.meta.server) {
      return null
    }
    const mod = await import('gsap')
    return mod.gsap
  }

  const animateCount = async (target: HTMLElement | string, from: number, to: number, duration = 0.9) => {
    const el = getEl(target)
    const gsap = await getGsap()
    if (!el || !gsap) {
      return
    }

    if (motionLevel.value === 'minimal') {
      el.textContent = Number(to).toFixed(0)
      return
    }

    const scaledDuration = Math.max(0.12, duration * durationScale.value)
    const state = { value: from }
    gsap.to(state, {
      value: to,
      duration: scaledDuration,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Number(state.value).toFixed(0)
      }
    })
  }

  const animateIn = async (target: HTMLElement | string, options: AnimateInOptions = {}) => {
    const el = getEl(target)
    const gsap = await getGsap()
    if (!el || !gsap) {
      return
    }

    if (motionLevel.value === 'minimal') {
      el.style.opacity = '1'
      el.style.transform = 'translate3d(0, 0, 0) scale(1)'
      return
    }

    const scaledDuration = Math.max(0.12, (options.duration ?? 0.45) * durationScale.value)
    const scaledDelay = (options.delay ?? 0) * durationScale.value

    gsap.fromTo(
      el,
      {
        opacity: options.opacity ?? 0,
        y: options.y ?? 12,
        x: options.x ?? 0,
        scale: 0.98
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: scaledDuration,
        delay: scaledDelay,
        ease: options.ease ?? 'power2.out'
      }
    )
  }

  const staggerList = async (container: HTMLElement | string, itemSelector: string, options: StaggerOptions = {}) => {
    const root = getEl(container)
    const gsap = await getGsap()
    if (!root || !gsap) {
      return
    }

    const items = root.querySelectorAll(itemSelector)
    if (!items.length) {
      return
    }

    if (motionLevel.value === 'minimal') {
      items.forEach((item) => {
        const htmlItem = item as HTMLElement
        htmlItem.style.opacity = '1'
        htmlItem.style.transform = 'translate3d(0, 0, 0)'
      })
      return
    }

    const scaledDuration = Math.max(0.1, (options.duration ?? 0.35) * durationScale.value)
    const scaledStagger = Math.max(0.015, (options.stagger ?? 0.06) * staggerScale.value)

    gsap.fromTo(
      items,
      {
        opacity: options.opacity ?? 0,
        y: options.y ?? 8
      },
      {
        opacity: 1,
        y: 0,
        duration: scaledDuration,
        stagger: scaledStagger,
        ease: options.ease ?? 'power2.out'
      }
    )
  }

  return {
    animateCount,
    animateIn,
    staggerList
  }
}
