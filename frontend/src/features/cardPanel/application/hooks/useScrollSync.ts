import { useEffect } from 'react'

export function useScrollSync(
  ref: React.RefObject<HTMLElement | null>,
  setScrollValue: (value: number) => void
) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleWheel = (evt: WheelEvent) => {
      evt.preventDefault()
      element.scrollLeft += evt.deltaY
      setScrollValue(evt.deltaY)
    }

    const handleTouchMove = (evt: TouchEvent) => {
      evt.preventDefault()
    }

    element.addEventListener('wheel', handleWheel, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      element.removeEventListener('wheel', handleWheel)
      element.removeEventListener('touchmove', handleTouchMove)
    }
  }, [ref, setScrollValue])
}
