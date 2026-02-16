export const useFileInput = () => {
  const getFirstFile = (payload: Event | FileList | File[] | null | undefined): File | null => {
    if (payload instanceof FileList) {
      return payload.item(0)
    }

    if (Array.isArray(payload)) {
      return payload[0] ?? null
    }

    if (payload && typeof payload === 'object' && 'target' in payload) {
      return (payload.target as HTMLInputElement | null)?.files?.[0] ?? null
    }

    return null
  }

  return {
    getFirstFile
  }
}
