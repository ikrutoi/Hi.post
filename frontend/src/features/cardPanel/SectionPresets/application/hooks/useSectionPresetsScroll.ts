import { useEffect } from 'react'
import { useLayoutControllers } from '@/features/layout/application/hooks'

export const useSectionPresetsScroll = (
  movingCards: (index: number) => void
) => {
  const { getSliderLine, getSliderLetter } = useLayoutControllers()

  useEffect(() => {
    const line = getSliderLine()
    if (line !== null) movingCards(Number(line))
  }, [getSliderLine])

  useEffect(() => {
    const letter = getSliderLetter()
    if (letter?.index !== undefined) movingCards(Number(letter.index))
  }, [getSliderLetter])
}
