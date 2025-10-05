import { setCardtext } from '../../infrastructure/state'
import type { AppDispatch } from '@app/state'
import type { CardtextState } from '../../domain/types'

export const cardtextController = (dispatch: AppDispatch) => ({
  updateText: (payload: Partial<CardtextState>) =>
    dispatch(setCardtext(payload)),
})
