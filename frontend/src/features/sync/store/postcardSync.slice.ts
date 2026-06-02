import { createSlice } from '@reduxjs/toolkit'
import { logout } from '@features/auth/infrastructure/state/auth.slice'
import type { PostcardSyncState } from '../domain/types/postcardSync.types'
import {
  fetchCloudBackupThunk,
  restoreCloudBackupThunk,
  uploadCloudBackupThunk,
} from './postcardSync.thunks'

const initialState: PostcardSyncState = {
  cloudBackup: null,
  fetchStatus: 'idle',
  error: null,
  uploadStatus: 'idle',
  uploadError: null,
  restoreStatus: 'idle',
  restoreError: null,
  autoBackupPending: false,
  lastAutoBackupAt: null,
  restorePromptOpen: false,
  restorePromptCloudUpdatedAt: null,
  restorePromptDismissedForUpdatedAt: null,
}

export const postcardSyncSlice = createSlice({
  name: 'postcardSync',
  initialState,
  reducers: {
    clearCloudBackupError(state) {
      state.error = null
      state.uploadError = null
      state.restoreError = null
    },
    resetPostcardSyncState() {
      return initialState
    },
    setAutoBackupPending(state, action: { payload: boolean }) {
      state.autoBackupPending = action.payload
    },
    openRestorePrompt(
      state,
      action: { payload: { cloudUpdatedAt: string } },
    ) {
      const { cloudUpdatedAt } = action.payload
      if (state.restorePromptDismissedForUpdatedAt === cloudUpdatedAt) return

      state.restorePromptOpen = true
      state.restorePromptCloudUpdatedAt = cloudUpdatedAt
    },
    dismissRestorePrompt(state) {
      if (state.restorePromptCloudUpdatedAt) {
        state.restorePromptDismissedForUpdatedAt =
          state.restorePromptCloudUpdatedAt
      }
      state.restorePromptOpen = false
    },
    closeRestorePrompt(state) {
      state.restorePromptOpen = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCloudBackupThunk.pending, (state) => {
        state.fetchStatus = 'loading'
        state.error = null
      })
      .addCase(fetchCloudBackupThunk.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded'
        state.cloudBackup = action.payload
      })
      .addCase(fetchCloudBackupThunk.rejected, (state, action) => {
        state.fetchStatus = 'failed'
        state.error = action.payload || 'Failed to load cloud backup'
      })
      .addCase(uploadCloudBackupThunk.pending, (state) => {
        state.uploadStatus = 'loading'
        state.uploadError = null
        state.autoBackupPending = false
      })
      .addCase(uploadCloudBackupThunk.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded'
        state.cloudBackup = action.payload
        state.fetchStatus = 'succeeded'
        state.error = null
        state.lastAutoBackupAt = action.payload.updatedAt
      })
      .addCase(uploadCloudBackupThunk.rejected, (state, action) => {
        state.uploadStatus = 'failed'
        state.uploadError = action.payload || 'Failed to save cloud backup'
      })
      .addCase(restoreCloudBackupThunk.pending, (state) => {
        state.restoreStatus = 'loading'
        state.restoreError = null
      })
      .addCase(restoreCloudBackupThunk.fulfilled, (state) => {
        state.restoreStatus = 'succeeded'
        state.restorePromptOpen = false
        if (state.restorePromptCloudUpdatedAt) {
          state.restorePromptDismissedForUpdatedAt =
            state.restorePromptCloudUpdatedAt
        }
      })
      .addCase(restoreCloudBackupThunk.rejected, (state, action) => {
        state.restoreStatus = 'failed'
        state.restoreError = action.payload || 'Failed to restore cloud backup'
      })
      .addCase(logout, () => initialState)
  },
})

export const {
  clearCloudBackupError,
  resetPostcardSyncState,
  setAutoBackupPending,
  openRestorePrompt,
  dismissRestorePrompt,
  closeRestorePrompt,
} = postcardSyncSlice.actions

export const postcardSyncReducer = postcardSyncSlice.reducer
