import { useEffect, useState, useRef } from 'react'

export const useTooltipPosition = (styleLeft: number, remSize: number) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [left, setLeft] = useState(0)
  const [visible, setVisible] = useState<'visible' | 'hidden'>('hidden')

  useEffect(() => {
    if (ref.current && remSize) {
      const width = ref.current.offsetWidth
      const calcLeft = styleLeft - width / 2 - 2 * remSize + 1
      setLeft(calcLeft)
      setVisible('visible')
    }
  }, [styleLeft, remSize])

  return { ref, left, visible }
}
