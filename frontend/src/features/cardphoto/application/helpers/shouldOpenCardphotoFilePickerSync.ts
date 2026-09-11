import type { RootState } from '@app/state'
import {
  selectCardphotoAssetToolbar,
  selectCardphotoOriginalUploadReminderActive,
  selectCardphotoSessionPendingProcessedId,
  selectCardphotoState,
} from '@cardphoto/infrastructure/selectors'
import { readCardphotoAddToolbarVisual } from './readCardphotoAddToolbarVisual'
import {
  isCardphotoAssetFromUserOriginalWorkflow,
  isCardphotoUserOriginalAsset,
} from './isCardphotoAssetFromUserOriginalWorkflow'

/** Sync subset of resolveCardphotoPendingProcessedIdSaga (no IDB scan). */
export function resolveCardphotoPendingProcessedIdSync(
  state: RootState,
): string | null {
  const cardphotoState = selectCardphotoState(state)
  const assetData = cardphotoState?.assetData
  const assetToolbar = selectCardphotoAssetToolbar(state)
  const originalUploadReminderActive =
    selectCardphotoOriginalUploadReminderActive(state)

  if (assetToolbar === 'cardphotoCreate') {
    return null
  }

  if (
    (assetData?.status === 'processed' || assetData?.status === 'outLine') &&
    assetData.id &&
    !isCardphotoUserOriginalAsset(assetData, cardphotoState?.userOriginalData) &&
    isCardphotoAssetFromUserOriginalWorkflow(
      assetData,
      cardphotoState?.userOriginalData,
      cardphotoState?.appliedData,
    )
  ) {
    return assetData.id
  }

  const originalId = cardphotoState?.userOriginalData?.id ?? null
  const sessionPendingId = selectCardphotoSessionPendingProcessedId(state)

  if (sessionPendingId && sessionPendingId !== originalId) {
    return sessionPendingId
  }

  if (originalUploadReminderActive) {
    return null
  }

  return null
}

/** Open gallery in pointerdown (user gesture) instead of saga + useEffect. */
export function shouldOpenCardphotoFilePickerSync(state: RootState): boolean {
  const addVisual = readCardphotoAddToolbarVisual(state)
  const originalReminder = selectCardphotoOriginalUploadReminderActive(state)

  if (addVisual.hasDot || originalReminder) return false

  if (resolveCardphotoPendingProcessedIdSync(state)) return false

  return true
}
