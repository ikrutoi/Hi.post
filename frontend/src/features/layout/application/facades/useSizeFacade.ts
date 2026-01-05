import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectSizeCard,
  selectSizeMiniCard,
  selectRemSize,
  selectScale,
  selectViewportSize,
  selectCardOrientation,
  selectCardDimensions,
  selectMiniCardDimensions,
} from '../../infrastructure/selectors'
import { useSizeController } from '../../application/controllers'

export const useSizeFacade = () => {
  const dispatch = useAppDispatch()

  const sizeCard = useAppSelector(selectSizeCard)
  const sizeMiniCard = useAppSelector(selectSizeMiniCard)
  const remSize = useAppSelector(selectRemSize)
  const scale = useAppSelector(selectScale)
  const viewportSize = useAppSelector(selectViewportSize)

  const cardOrientation = useAppSelector(selectCardOrientation)
  const cardDimensions = useAppSelector(selectCardDimensions)
  const miniCardDimensions = useAppSelector(selectMiniCardDimensions)

  const actions = useMemo(() => useSizeController(dispatch), [dispatch])

  return {
    size: {
      sizeCard,
      sizeMiniCard,
      remSize,
      scale,
      viewportSize,
      cardOrientation,
      cardDimensions,
      miniCardDimensions,
    },
    actions,
  }
}
