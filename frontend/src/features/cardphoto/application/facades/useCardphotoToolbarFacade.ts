import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'

import { updateCardphotoToolbar } from '../state/cardphotoToolbarSlice'
import { selectCardphotoToolbar } from '../state/cardphotoToolbarSelectors'

export const useCardphotoToolbarFacade = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(selectCardphotoToolbar)

  return {
    state,
    update: (payload: Partial<typeof state>) =>
      dispatch(updateCardphotoToolbar(payload)),
  }
}
