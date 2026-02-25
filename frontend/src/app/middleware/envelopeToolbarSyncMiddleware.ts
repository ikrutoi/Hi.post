import type { Middleware } from '@reduxjs/toolkit'
import { setRecipientMode } from '@envelope/infrastructure/state'
import { updateToolbarSection } from '@toolbar/infrastructure/state'

/**
 * При переключении single → multi синхронно обновляет стейт Apply секции 'recipients',
 * чтобы не было мигания (сага обновляет стейт асинхронно, и иконка успевает показать disabled).
 */
export const envelopeToolbarSyncMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (
      setRecipientMode.match(action) &&
      action.payload === 'multi'
    ) {
      const state = store.getState()
      const selectedIds =
        state.envelopeSelection?.selectedRecipientIds ?? []
      store.dispatch(
        updateToolbarSection({
          section: 'recipients',
          value: {
            apply: {
              state: selectedIds.length >= 1 ? 'enabled' : 'disabled',
              options: {},
            },
          },
        }),
      )
    }
    return next(action)
  }
