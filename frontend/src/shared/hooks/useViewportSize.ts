import { useState, useEffect, useRef } from 'react'
import { getViewportSize } from '../helpers'
import type { ViewportSize } from '../config/constants'

export const useViewportSize = (): ViewportSize => {
  const [viewportSize, setViewportSize] = useState<ViewportSize>(
    getViewportSize(typeof window !== 'undefined' ? window.innerWidth : 1024)
  )

  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }

      frameRef.current = requestAnimationFrame(() => {
        const newSize = getViewportSize(window.innerWidth)
        setViewportSize((prevSize) =>
          prevSize !== newSize ? newSize : prevSize
        )
      })
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return viewportSize
}
