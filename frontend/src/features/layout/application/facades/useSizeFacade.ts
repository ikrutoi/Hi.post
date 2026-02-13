import React from 'react'
import { useAppSelector } from '@app/hooks'
import {
  selectSizeToolbarContour,
  selectSizeCard,
  selectSizeMiniCard,
  selectSizeItemCalendar,
  selectSizeItemAroma,
  selectRemSize,
  // selectScale,
  selectSectionMenuHeight,
  selectViewportSize,
  selectCardOrientation,
  selectCardDimensions,
  selectMiniCardDimensions,
} from '../../infrastructure/selectors'
import { useSizeController } from '../../application/controllers'

export const useSizeFacade = () => {
  const sizeToolbarContour = useAppSelector(selectSizeToolbarContour)
  const sizeCard = useAppSelector(selectSizeCard)
  const sizeMiniCard = useAppSelector(selectSizeMiniCard)
  const sizeItemCalendar = useAppSelector(selectSizeItemCalendar)
  const sizeItemAroma = useAppSelector(selectSizeItemAroma)
  const remSize = useAppSelector(selectRemSize)
  // const scale = useAppSelector(selectScale)
  const sectionMenuHeight = useAppSelector(selectSectionMenuHeight)
  const viewportSize = useAppSelector(selectViewportSize)
  const cardOrientation = useAppSelector(selectCardOrientation)
  const cardDimensions = useAppSelector(selectCardDimensions)
  const miniCardDimensions = useAppSelector(selectMiniCardDimensions)

  const actions = useSizeController()

  return {
    sizeToolbarContour,
    sizeCard,
    sizeMiniCard,
    sizeItemCalendar,
    sizeItemAroma,
    remSize,
    // scale,
    sectionMenuHeight,
    viewportSize,
    cardOrientation,
    cardDimensions,
    miniCardDimensions,

    ...actions,

    size: {
      sizeCard,
      sizeMiniCard,
      remSize,
      // scale,
      sectionMenuHeight,
      viewportSize,
      cardOrientation,
      cardDimensions,
      miniCardDimensions,
    },
  }
}
