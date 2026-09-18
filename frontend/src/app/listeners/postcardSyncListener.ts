import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { RootState } from '@app/state/store'
import { selectIsAuthenticated } from '@features/auth/infrastructure/selectors/authSelectors'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'
import {
  setAutoBackupPending,
  markV2SyncSucceeded,
} from '@features/sync/store/postcardSync.slice'
import {
  flushPendingV2Sync,
  hasPendingV2Sync,
} from '@features/sync/infrastructure/postcardV2PendingSync'
import { isHttpAuthMode } from '@shared/config/authMode'

const V2_SYNC_DEBOUNCE_MS = 3000

export const postcardSyncListenerMiddleware = createListenerMiddleware()

postcardSyncListenerMiddleware.startListening({
  actionCreator: postcardLocalDataChanged,
  effect: async (_action, listenerApi) => {
    if (!isHttpAuthMode()) return

    const state = listenerApi.getState() as RootState
    if (!selectIsAuthenticated(state)) return
    if (!hasPendingV2Sync()) return

    listenerApi.cancelActiveListeners()
    listenerApi.dispatch(setAutoBackupPending(true))

    await listenerApi.delay(V2_SYNC_DEBOUNCE_MS)

    if (listenerApi.signal.aborted) return

    const nextState = listenerApi.getState() as RootState
    if (!selectIsAuthenticated(nextState)) {
      listenerApi.dispatch(setAutoBackupPending(false))
      return
    }

    try {
      await flushPendingV2Sync()
      listenerApi.dispatch(markV2SyncSucceeded())
    } catch {
      listenerApi.dispatch(setAutoBackupPending(false))
    }
  },
})
