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

export const selectCloudBackupRestoreStatus = (state: RootState) =>
  state.postcardSync.restoreStatus

export const selectCloudBackupRestoreError = (state: RootState) =>
  state.postcardSync.restoreError

export const selectHasCloudBackup = (state: RootState) =>
  state.postcardSync.cloudBackup != null

export const selectCloudBackupPostcardCount = (state: RootState) =>
  state.postcardSync.cloudBackup?.postcards.length ?? 0

export const selectAutoBackupPending = (state: RootState) =>
  state.postcardSync.autoBackupPending

export const selectLastAutoBackupAt = (state: RootState) =>
  state.postcardSync.lastAutoBackupAt

export const selectRestorePromptOpen = (state: RootState) =>
  state.postcardSync.restorePromptOpen

export const selectRestorePromptCloudUpdatedAt = (state: RootState) =>
  state.postcardSync.restorePromptCloudUpdatedAt
