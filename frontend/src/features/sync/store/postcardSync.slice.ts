import { createSlice } from '@reduxjs/toolkit'
import { logout } from '@features/auth/infrastructure/state/auth.slice'
import type { PostcardSyncState } from '../domain/types/postcardSync.types'
import {
  fetchCloudBackupThunk,
  uploadCloudBackupThunk,
} from './postcardSync.thunks'

const initialState: PostcardSyncState = {
  cloudBackup: null,
  fetchStatus: 'idle',
  error: null,
  uploadStatus: 'idle',
  uploadError: null,
}

export const postcardSyncSlice = createSlice({
  name: 'postcardSync',
  initialState,
  reducers: {
    clearCloudBackupError(state) {
      state.error = null
      state.uploadError = null
    },
    resetPostcardSyncState() {
      return initialState
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
      })
      .addCase(uploadCloudBackupThunk.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded'
        state.cloudBackup = action.payload
        state.fetchStatus = 'succeeded'
        state.error = null
      })
      .addCase(uploadCloudBackupThunk.rejected, (state, action) => {
        state.uploadStatus = 'failed'
        state.uploadError = action.payload || 'Failed to save cloud backup'
      })
      .addCase(logout, () => initialState)
  },
})

export const { clearCloudBackupError, resetPostcardSyncState } =
  postcardSyncSlice.actions

export const postcardSyncReducer = postcardSyncSlice.reducer
