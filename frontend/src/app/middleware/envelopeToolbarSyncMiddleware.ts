import type { Middleware } from '@reduxjs/toolkit'
import { setRecipientMode } from '@envelope/recipient/infrastructure/state'
import { updateToolbarSection } from '@toolbar/infrastructure/state'

/**
 * При переключении single → multi синхронно обновляет стейт Apply секции 'recipients'
 * (чтобы не было мигания). Адресная книга уже подгружается при открытии секции Конверт.
 */
export const envelopeToolbarSyncMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (
      setRecipientMode.match(action) &&
      action.payload === 'recipients'
    ) {
      const state = store.getState()
      const selectedIds =
        state.envelopeSelection?.recipientsPendingIds ?? []
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
