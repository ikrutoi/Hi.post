import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectSizeCard,
  selectSizeMiniCard,
  selectRemSize,
} from '../../infrastructure/selectors'
import { sizeController } from '../../application/controllers'

export const useSizeFacade = () => {
  const dispatch = useAppDispatch()
  const sizeCard = useAppSelector(selectSizeCard)
  const sizeMiniCard = useAppSelector(selectSizeMiniCard)
  const remSize = useAppSelector(selectRemSize)

  const { setSizeCard, setSizeMiniCard, setRemSize } = sizeController(dispatch)

  return {
    size: {
      sizeCard,
      sizeMiniCard,
      remSize,
    },
    actions: {
      setSizeCard,
      setSizeMiniCard,
      setRemSize,
    },
  }
}
