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

    const state = { value: from }
    gsap.to(state, {
      value: to,
      duration,
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
        duration: options.duration ?? 0.45,
        delay: options.delay ?? 0,
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

    gsap.fromTo(
      items,
      {
        opacity: options.opacity ?? 0,
        y: options.y ?? 8
      },
      {
        opacity: 1,
        y: 0,
        duration: options.duration ?? 0.35,
        stagger: options.stagger ?? 0.06,
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
