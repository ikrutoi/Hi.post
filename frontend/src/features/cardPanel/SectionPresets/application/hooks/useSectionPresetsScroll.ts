import { useEffect } from 'react'
import { useLayoutFacade } from '@layout/application/facades'

export const useSectionPresetsScroll = (
  movingCards: (index: number) => void
) => {
  const { meta } = useLayoutFacade()
  const { sliderLetter, sliderLine } = meta

  useEffect(() => {
    if (sliderLine !== null) movingCards(Number(sliderLine))
  }, [sliderLine])

  useEffect(() => {
    if (sliderLetter?.index !== undefined)
      movingCards(Number(sliderLetter.index))
  }, [sliderLetter])
}
