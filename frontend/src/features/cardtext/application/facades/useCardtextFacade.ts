import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'
import { updateCardtext } from '../state/cardtextSlice'
import { selectCardtext } from '../state/cardtextSelectors'

export const useCardTextFacade = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(selectCardtext)

  return {
    state,
    update: (payload: Partial<typeof state>) =>
      dispatch(updateCardtext(payload)),
  }
}
