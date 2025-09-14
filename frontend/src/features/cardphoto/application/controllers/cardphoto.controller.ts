import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateCardphoto, selectCardphotoState } from '../state'

export const useCardphotoController = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(selectCardphotoState)

  const update = (payload: Partial<typeof state>) =>
    dispatch(updateCardphoto(payload))

  return { state, update }
}
