import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import type {
  CardphotoState,
  CardphotoOperation,
  WorkingConfig,
  ImageMeta,
} from '../../domain/types'

export const selectCardphotoSlice = (state: RootState) => state.cardphoto

export const selectCardphotoState = (state: RootState): CardphotoState | null =>
  state.cardphoto.state

export const selectCardphotoIsComplete = (state: RootState): boolean =>
  state.cardphoto.isComplete

export const selectStockImage = (state: RootState): ImageMeta | null =>
  state.cardphoto.state?.base.stock.image || null

export const selectUserImage = (state: RootState): ImageMeta | null =>
  state.cardphoto.state?.base.user.image || null

export const selectAppliedImage = (state: RootState): ImageMeta | null =>
  state.cardphoto.state?.base.apply.image || null

export const selectOperations = createSelector(
  (state: RootState) => state.cardphoto.state?.operations,
  (operations): CardphotoOperation[] => operations ?? []
)

export const selectActiveIndex = (state: RootState): number =>
  state.cardphoto.state?.activeIndex ?? -1

export const selectActiveOperation = (
  state: RootState
): CardphotoOperation | null => {
  const s = state.cardphoto.state
  if (!s) return null
  return s.operations[s.activeIndex] || null
}

export const selectCurrentConfig = (state: RootState): WorkingConfig | null =>
  state.cardphoto.state?.currentConfig ?? null
