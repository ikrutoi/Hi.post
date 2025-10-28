import { useAppDispatch, useAppSelector } from '@app/hooks'
import { cardphotoActions } from '../../infrastructure/state'
import { selectCardphotoState } from '../../infrastructure/selectors'
import type { CardphotoState } from '../../domain/types'

export const useCardphotoController = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(selectCardphotoState)

  const update = (payload: Partial<CardphotoState>) =>
    dispatch(cardphotoActions.updateCardphoto(payload))
  const reset = () => dispatch(cardphotoActions.resetCardphoto())

  return { state, update, reset }
}
