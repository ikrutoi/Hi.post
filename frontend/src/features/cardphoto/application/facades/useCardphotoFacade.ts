import { useAppSelector } from '@app/hooks/useAppSelector'
import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { updateCardphoto } from '../state/cardphotoSlice'
import { selectCardphotoState } from '../state/cardphotoSelectors'

export const useCardPhotoFacade = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(selectCardphotoState)

  return {
    state,
    update: (payload: Partial<typeof state>) =>
      dispatch(updateCardphoto(payload)),
  }
}
