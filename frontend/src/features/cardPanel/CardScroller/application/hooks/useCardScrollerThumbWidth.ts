import { useEffect, useState } from 'react'

export const useCardScrollerThumbWidth = (
  ref: React.RefObject<HTMLDivElement | null>,
  totalCards: number,
  maxCards: number,
  deltaEnd: number
) => {
  const [thumbWidth, setThumbWidth] = useState<number | null>(null)

  useEffect(() => {
    if (ref.current) {
      const width = ref.current.clientWidth
      const calculated =
        (width / totalCards) * (deltaEnd ? maxCards : maxCards - 1)
      setThumbWidth(calculated)
    }
  }, [ref, totalCards, maxCards, deltaEnd])

  return thumbWidth
}
