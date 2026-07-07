import { RootState } from '@app/state'
import { AromaState } from '@entities/aroma/domain/types'

export const selectAromaState = (state: RootState): AromaState => state.aroma

export const selectSelectedAroma = (state: RootState) =>
  state.aroma.selectedAroma

export const selectViewAroma = (state: RootState) => state.aroma.viewAroma

/** Tile highlight in aroma grid: draft preview, then applied. */
export const selectAromaDisplayAroma = (state: RootState) =>
  state.aroma.viewAroma ?? state.aroma.selectedAroma

export const selectIsAromaComplete = (state: RootState) =>
  state.aroma.isComplete

export const selectAromaApplyMatches = (state: RootState) => {
  const viewAroma = state.aroma.viewAroma
  const selectedAroma = state.aroma.selectedAroma
  return (
    viewAroma != null &&
    selectedAroma != null &&
    viewAroma.index === selectedAroma.index
  )
}
