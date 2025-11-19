import { useEffect, useState } from 'react'

export const useFlashEffect = (shouldFlash: boolean, duration = 200) => {
  const [isFlashing, setIsFlashing] = useState(false)

  useEffect(() => {
    if (!shouldFlash) return

    setIsFlashing(true)
    const timeout = setTimeout(() => setIsFlashing(false), duration)

    return () => clearTimeout(timeout)
  }, [shouldFlash, duration])

  return isFlashing
}
