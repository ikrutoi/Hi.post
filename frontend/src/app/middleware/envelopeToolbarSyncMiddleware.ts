import type { Middleware } from '@reduxjs/toolkit'
import { setRecipientMode } from '@envelope/recipient/infrastructure/state'
import { setActiveAddressList } from '@envelope/infrastructure/state'
import { setAddressBookMode } from '@envelope/addressBook/infrastructure/state'
import { closeAddressList } from '@envelope/infrastructure/state'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import type { RootState } from '@app/state'

export const envelopeToolbarSyncMiddleware: Middleware =
  (store) => (next) => (action) => {
    // До редьюсера: при смене режима сохраняем открытый список, чтобы иконка не мигала
    if (setRecipientMode.match(action)) {
      const stateBefore = store.getState() as RootState
      const activeBefore = stateBefore.envelopeSelection?.activeAddressList ?? null
      if (action.payload === 'recipients' && activeBefore === 'recipient') {
        store.dispatch(setActiveAddressList('recipients'))
      } else if (action.payload === 'recipient' && activeBefore === 'recipients') {
        store.dispatch(setActiveAddressList('recipient'))
      }
    }

    const result = next(action)

    if (setActiveAddressList.match(action) || closeAddressList.match(action)) {
      const state = store.getState() as RootState
      const active = state.envelopeSelection?.activeAddressList ?? null
      store.dispatch(setAddressBookMode(active))
    }

    if (setRecipientMode.match(action) && action.payload === 'recipients') {
      const state = store.getState() as RootState
      const activeAddressList = state.envelopeSelection?.activeAddressList ?? null
      const selectedIds = state.envelopeSelection?.recipientsPendingIds ?? []
      const recipientCount = state.addressBook?.recipientEntries?.length ?? 0
      const listOpen = activeAddressList === 'recipients'
      const addressListValue = listOpen
        ? {
            state: 'active' as const,
            options: {
              badge: recipientCount > 0 ? recipientCount : null,
            },
          }
        : {
            state: (recipientCount > 0 ? 'enabled' : 'disabled') as
              | 'enabled'
              | 'disabled',
            options: {
              badge: recipientCount > 0 ? recipientCount : null,
            },
          }
      store.dispatch(
        updateToolbarSection({
          section: 'recipients',
          value: {
            apply: {
              state: selectedIds.length >= 1 ? 'enabled' : 'disabled',
              options: {},
            },
            addressList: addressListValue,
          },
        }),
      )
    }

    return result
  }
