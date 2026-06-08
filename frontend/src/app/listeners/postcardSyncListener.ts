import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { RootState } from '@app/state/store'
import { selectIsAuthenticated } from '@features/auth/infrastructure/selectors/authSelectors'
import { shouldOfferCloudRestore } from '@features/sync/application/services/compareLocalAndCloudBackup'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'
import {
  dismissRestorePrompt,
  openRestorePrompt,
  setAutoBackupPending,
} from '@features/sync/store/postcardSync.slice'
import {
  fetchCloudBackupThunk,
  uploadCloudBackupThunk,
} from '@features/sync/store/postcardSync.thunks'

const AUTO_BACKUP_DEBOUNCE_MS = 3000

export const postcardSyncListenerMiddleware = createListenerMiddleware()

function isHttpAuthMode(): boolean {
  return import.meta.env.VITE_AUTH_MODE === 'http'
}

function shouldSkipAutoBackup(state: RootState): boolean {
  return (
    !selectIsAuthenticated(state) ||
    state.postcardSync.restoreStatus === 'loading' ||
    state.postcardSync.uploadStatus === 'loading'
  )
}

postcardSyncListenerMiddleware.startListening({
  actionCreator: postcardLocalDataChanged,
  effect: async (_action, listenerApi) => {
    if (!isHttpAuthMode()) return

    const state = listenerApi.getState() as RootState
    if (shouldSkipAutoBackup(state)) return

    listenerApi.cancelActiveListeners()
    listenerApi.dispatch(setAutoBackupPending(true))

    await listenerApi.delay(AUTO_BACKUP_DEBOUNCE_MS)

    if (listenerApi.signal.aborted) return

    const nextState = listenerApi.getState() as RootState
    if (shouldSkipAutoBackup(nextState)) {
      listenerApi.dispatch(setAutoBackupPending(false))
      return
    }

    listenerApi.dispatch(setAutoBackupPending(false))
    listenerApi.dispatch(uploadCloudBackupThunk())
  },
})

postcardSyncListenerMiddleware.startListening({
  actionCreator: fetchCloudBackupThunk.fulfilled,
  effect: async (action, listenerApi) => {
    if (!isHttpAuthMode()) return

    const cloudBackup = action.payload
    if (!cloudBackup || cloudBackup.postcards.length === 0) return

    const state = listenerApi.getState() as RootState
    if (
      state.postcardSync.restorePromptDismissedForUpdatedAt ===
      cloudBackup.updatedAt
    ) {
      return
    }

    const localPostcards = await postcardsAdapter.getAll()
    if (!shouldOfferCloudRestore(localPostcards, cloudBackup)) return

    listenerApi.dispatch(
      openRestorePrompt({ cloudUpdatedAt: cloudBackup.updatedAt }),
    )
  },
})

postcardSyncListenerMiddleware.startListening({
  actionCreator: dismissRestorePrompt,
  effect: async (_action, listenerApi) => {
    if (!isHttpAuthMode()) return
    if (!selectIsAuthenticated(listenerApi.getState() as RootState)) return

    const localPostcards = await postcardsAdapter.getAll()
    if (localPostcards.length === 0) return

    listenerApi.dispatch(uploadCloudBackupThunk())
  },
})
