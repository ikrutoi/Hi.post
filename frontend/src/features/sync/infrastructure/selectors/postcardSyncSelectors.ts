import type { RootState } from '@app/state'

export const selectPostcardSyncState = (state: RootState) => state.postcardSync

export const selectCloudBackup = (state: RootState) =>
  state.postcardSync.cloudBackup

export const selectCloudBackupFetchStatus = (state: RootState) =>
  state.postcardSync.fetchStatus

export const selectCloudBackupError = (state: RootState) =>
  state.postcardSync.error

export const selectCloudBackupUploadStatus = (state: RootState) =>
  state.postcardSync.uploadStatus

export const selectCloudBackupUploadError = (state: RootState) =>
  state.postcardSync.uploadError

export const selectHasCloudBackup = (state: RootState) =>
  state.postcardSync.cloudBackup != null

export const selectCloudBackupPostcardCount = (state: RootState) =>
  state.postcardSync.cloudBackup?.postcards.length ?? 0
