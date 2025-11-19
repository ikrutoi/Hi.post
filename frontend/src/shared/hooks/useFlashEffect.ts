import { useState } from 'react'
import type { Switcher } from '@entities/date/domain/types'

export const useFlashEffect = () => {
  const [flashParts, setFlashParts] = useState<Switcher[]>([])

  const triggerFlash = (part: Switcher) => {
    setFlashParts((prev) => [...prev, part])
    setTimeout(() => {
      setFlashParts((prev) => prev.filter((p) => p !== part))
    }, 500)
  }

  return {
    triggerFlash,
    flashParts,
  }
}
