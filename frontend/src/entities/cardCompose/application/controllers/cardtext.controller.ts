import {
  updateCardCompose,
  resetCardCompose,
} from '../../infrastructure/state/cardCompose.slice'
import type { AppDispatch } from '@app/state'
import type { CardCompose } from '../../domain/types/cardCompose.types'

export const cardComposeController = (dispatch: AppDispatch) => ({
  update: (payload: Partial<CardCompose>) =>
    dispatch(updateCardCompose(payload)),
  reset: () => dispatch(resetCardCompose()),
})
