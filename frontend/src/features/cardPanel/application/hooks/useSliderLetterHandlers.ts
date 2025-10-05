import { useCallback } from 'react'

import { useLayoutFacade } from '@layout/application/facades'

export const useSliderLetterHandlers = () => {
  const {
    actions: { setSliderLine, setSliderLetter, setSliderLetterPayload },
  } = useLayoutFacade()

  const handleChangeFromSliderCardsList = useCallback(
    (value: number | string) => {
      setSliderLine(Number(value))
    },
    [setSliderLine]
  )

  const handleLetterClick = useCallback(
    (evt: React.MouseEvent<HTMLSpanElement>) => {
      const { textContent, dataset } = evt.target as HTMLSpanElement
      if (textContent) {
        setSliderLetter({
          value: textContent,
          index: Number(dataset.index),
        })
        setSliderLetterPayload({
          value: textContent,
          index: Number(dataset.index),
          id: dataset.id,
        })
        setSliderLine(Number(dataset.index || 0))
      }
    },
    [setSliderLetter, setSliderLetterPayload, setSliderLine]
  )

  return {
    handleChangeFromSliderCardsList,
    handleLetterClick,
  }
}
