import { useState, useLayoutEffect } from 'react'
import useResizeObserver from '@react-hook/resize-observer'

export const useSize = (
  ref: React.RefObject<HTMLDivElement | null>
): { width: number; height: number } | undefined => {
  const [size, setSize] = useState<{ width: number; height: number }>()

  useLayoutEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect()
      setSize({ width, height })
    }
  }, [])

  useResizeObserver(ref, (entry) => {
    const { width, height } = entry.contentRect
    setSize({ width, height })
  })

  return size
}
