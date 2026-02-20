export default defineAppConfig({
  ui: {
    primary: 'amber',
    gray: 'slate',
    strategy: 'override',
    card: {
      background: 'bg-[color:var(--ui-surface)]/90 backdrop-blur-xl',
      divide: 'divide-y divide-white/10',
      ring: 'ring-1 ring-white/10',
      rounded: 'rounded-2xl',
      shadow: 'shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]'
    },
    inputMenu: {
      background: 'bg-[color:var(--ui-surface-alt)]',
      ring: 'ring-1 ring-white/10',
      shadow: 'shadow-[0_20px_50px_-30px_rgba(0,0,0,0.95)]',
      rounded: 'rounded-xl',
      option: {
        color: 'text-slate-100',
        active: 'bg-white/10 text-slate-50',
        inactive: 'bg-transparent text-slate-200',
        icon: {
          active: 'text-amber-300',
          inactive: 'text-slate-400'
        },
        selectedIcon: {
          base: 'h-5 w-5 text-amber-300 flex-shrink-0'
        }
      },
      arrow: {
        ring: 'before:ring-1 before:ring-white/10',
        background: 'before:bg-[color:var(--ui-surface-alt)]'
      }
    },
    selectMenu: {
      background: 'bg-[color:var(--ui-surface-alt)]',
      ring: 'ring-1 ring-white/10',
      shadow: 'shadow-[0_20px_50px_-30px_rgba(0,0,0,0.95)]',
      rounded: 'rounded-xl',
      input: 'block w-[calc(100%+0.5rem)] focus:ring-transparent text-sm px-3 py-1.5 text-slate-100 bg-[color:var(--ui-surface-alt)] border-0 border-b border-white/10 sticky -top-1 -mt-1 mb-1 -mx-1 z-10 placeholder-slate-400 focus:outline-none',
      option: {
        color: 'text-slate-100',
        active: 'bg-white/10 text-slate-50',
        inactive: 'bg-transparent text-slate-200',
        icon: {
          active: 'text-amber-300',
          inactive: 'text-slate-400'
        },
        selectedIcon: {
          base: 'h-5 w-5 text-amber-300 flex-shrink-0'
        }
      },
      arrow: {
        ring: 'before:ring-1 before:ring-white/10',
        background: 'before:bg-[color:var(--ui-surface-alt)]'
      }
    },
    modal: {
      background: 'bg-[color:var(--ui-surface)]',
      ring: 'ring-1 ring-white/10',
      rounded: 'rounded-2xl',
      shadow: 'shadow-[0_40px_100px_-40px_rgba(0,0,0,1)]',
      overlay: {
        background: 'bg-black/75 backdrop-blur-sm'
      }
    },
    slideover: {
      background: 'bg-[color:var(--ui-surface)]',
      ring: 'ring-1 ring-white/10',
      shadow: 'shadow-[0_40px_100px_-40px_rgba(0,0,0,1)]',
      overlay: {
        background: 'bg-black/75 backdrop-blur-sm'
      }
    }
  }
})