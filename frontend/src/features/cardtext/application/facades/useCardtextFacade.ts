import { useCardtextController } from '../controllers'
import type { CardtextState } from '../../domain/types'

export const useCardtextFacade = () => {
  const {
    state: { cardtextState },
    actions: { update, clearContent, reset },
  } = useCardtextController()

  const safeUpdate = (payload: Partial<CardtextState>) => {
    if (Object.keys(payload).length > 0) {
      update(payload)
    }
  }

  return {
    data: cardtextState,
    actions: {
      update: safeUpdate,
      clearContent,
      reset,
    },
  }
}
