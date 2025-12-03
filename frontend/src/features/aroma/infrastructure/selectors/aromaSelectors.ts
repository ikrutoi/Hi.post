import { RootState } from '@app/state'
import { AromaState } from '@entities/aroma/domain/types'

export const selectAromaState = (state: RootState): AromaState => state.aroma

export const selectSelectedAroma = (state: RootState) =>
  state.aroma.selectedAroma

export const selectIsAromaComplete = (state: RootState) =>
  state.aroma.isComplete
