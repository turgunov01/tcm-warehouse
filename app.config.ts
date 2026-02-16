export default defineAppConfig({
  ui: {
    primary: 'slate',
    gray: 'slate',
    strategy: 'override',
    card: {
      background: 'bg-transparent',
      divide: 'divide-y divide-[#eeeeee]',
      ring: 'ring-1 ring-[#eeeeee]',
      rounded: 'rounded-xl',
      shadow: 'shadow-none'
    },
    inputMenu: {
      background: 'bg-white',
      ring: 'ring-1 ring-[#eeeeee]',
      shadow: 'shadow-none',
      rounded: 'rounded-xl',
      option: {
        color: 'text-black',
        active: 'bg-[#f5f5f5] text-black',
        inactive: 'bg-white text-black',
        icon: {
          active: 'text-black',
          inactive: 'text-black'
        },
        selectedIcon: {
          base: 'h-5 w-5 text-black flex-shrink-0'
        }
      },
      arrow: {
        ring: 'before:ring-1 before:ring-[#eeeeee]',
        background: 'before:bg-white'
      }
    },
    selectMenu: {
      background: 'bg-white',
      ring: 'ring-1 ring-[#eeeeee]',
      shadow: 'shadow-none',
      rounded: 'rounded-xl',
      input: 'block w-[calc(100%+0.5rem)] focus:ring-transparent text-sm px-3 py-1.5 text-black bg-white border-0 border-b border-[#eeeeee] sticky -top-1 -mt-1 mb-1 -mx-1 z-10 placeholder-gray-400 focus:outline-none',
      option: {
        color: 'text-black',
        active: 'bg-[#f5f5f5] text-black',
        inactive: 'bg-white text-black',
        icon: {
          active: 'text-black',
          inactive: 'text-black'
        },
        selectedIcon: {
          base: 'h-5 w-5 text-black flex-shrink-0'
        }
      },
      arrow: {
        ring: 'before:ring-1 before:ring-[#eeeeee]',
        background: 'before:bg-white'
      }
    },
    modal: {
      background: 'bg-white',
      ring: 'ring-1 ring-[#eeeeee]',
      rounded: 'rounded-xl',
      shadow: 'shadow-none',
      overlay: {
        background: 'bg-gray-200/75'
      }
    },
    slideover: {
      background: 'bg-white',
      ring: 'ring-1 ring-[#eeeeee]',
      shadow: 'shadow-none',
      overlay: {
        background: 'bg-gray-200/75'
      }
    }
  }
})
