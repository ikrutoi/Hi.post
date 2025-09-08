import { useAppSelector } from '@app/hooks/useAppSelector'
import { useAppDispatch } from '@app/hooks/useAppDispatch'

import { selectCardphotoButtons } from '../store/selectors'
import {
  updateCardphotoButtonsState,
  setCardphotoClick,
} from '../store/cardphotoButtonsSlice'

export const useCardphotoButtonsFacade = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(selectCardphotoButtons)

  const updateState = (payload: Partial<typeof state>) => {
    dispatch(updateCardphotoButtonsState(payload))
  }

  const setClick = (value: boolean | null) => {
    dispatch(setCardphotoClick(value))
  }

  return {
    ...state,
    updateState,
    setClick,
  }
}
