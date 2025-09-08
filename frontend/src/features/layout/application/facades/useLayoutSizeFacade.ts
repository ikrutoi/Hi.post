import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'
import { sizeActions } from '../state/layoutActions'
import {
  selectSizeCard,
  selectSizeMiniCard,
  selectRemSize,
} from '../state/layoutSelectors'

export const useLayoutSizeFacade = () => {
  const dispatch = useAppDispatch()

  return {
    sizeCard: useAppSelector(selectSizeCard),
    sizeMiniCard: useAppSelector(selectSizeMiniCard),
    remSize: useAppSelector(selectRemSize),

    setSizeCard: (payload: Partial<{ width: number; height: number }>) =>
      dispatch(sizeActions.setSizeCard(payload)),

    setSizeMiniCard: (payload: Partial<{ width: number; height: number }>) =>
      dispatch(sizeActions.setSizeMiniCard(payload)),

    setRemSize: (value: number | null) =>
      dispatch(sizeActions.setRemSize(value)),
  }
}
