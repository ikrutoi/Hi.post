import { useCallback } from 'react'

export const useGlobalListeners = () => {
  const attach = useCallback(
    (
      mouseMove: (e: MouseEvent) => void,
      mouseUp: (e: MouseEvent) => void,
      touchMove: (e: TouchEvent) => void,
      touchEnd: (e: TouchEvent) => void
    ) => {
      window.addEventListener('mousemove', mouseMove)
      window.addEventListener('mouseup', mouseUp)
      window.addEventListener('touchmove', touchMove, { passive: false })
      window.addEventListener('touchend', touchEnd)

      return () => {
        window.removeEventListener('mousemove', mouseMove)
        window.removeEventListener('mouseup', mouseUp)
        window.removeEventListener('touchmove', touchMove)
        window.removeEventListener('touchend', touchEnd)
      }
    },
    []
  )

  return { attach }
}
