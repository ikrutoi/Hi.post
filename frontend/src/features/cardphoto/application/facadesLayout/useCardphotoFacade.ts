import { useAppDispatch, useAppSelector } from '@app/hooks'
import { cardphotoActions } from '../../infrastructure/stateLayout'
import { selectCardphotoState } from '../../infrastructure/selectorsLayout'
import type { CardphotoLayoutState } from '../../domain/typesLayout'

export const useCardphotoFacade = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(selectCardphotoState)

  const update = (payload: Partial<CardphotoLayoutState>) => {
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
