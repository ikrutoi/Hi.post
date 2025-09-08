import { useAppSelector } from '@app/hooks/useAppSelector'
import { useAppDispatch } from '@app/hooks/useAppDispatch'

import { selectCardtextToolbar } from '../state/cardtextToolbarSelectors'
import { updateCardtextToolbar } from '../state/cardtextToolbarSlice'

export const useCardtextButtonsFacade = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(selectCardtextToolbar)

  const updateState = (payload: Partial<typeof state>) => {
    dispatch(updateCardtextToolbar(payload))
  }

  return {
    ...state,
    updateState,
  }
}
