import type { Middleware } from '@reduxjs/toolkit'
import { setRecipientMode } from '@envelope/infrastructure/state'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import { incrementAddressBookReloadVersion } from '@features/previewStrip/infrastructure/state'

/**
 * При переключении single → multi:
 * 1) Синхронно обновляет стейт Apply секции 'recipients' (чтобы не было мигания).
 * 2) Запускает подгрузку адресной книги, чтобы форма Пользователи и список адресов были актуальными.
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
      store.dispatch(incrementAddressBookReloadVersion())
    }
    return next(action)
  }
