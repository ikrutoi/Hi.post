import { useAppDispatch, useAppSelector } from '@app/hooks'
import { cardphotoActions } from '../../infrastructure/stateLayout'
import { selectCardphotoState } from '../../infrastructure/selectorsLayout'
import type { CardphotoState } from '@entities/cardphoto/domain/types'

export const useCardphotoFacade = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(selectCardphotoState)

  const update = (payload: Partial<CardphotoState>) => {
    dispatch(cardphotoActions.updateCardphoto(payload))
  }

  const reset = () => {
    dispatch(cardphotoActions.resetCardphoto())
  }

  return {
    state,
    update,
    reset,
  }
}
