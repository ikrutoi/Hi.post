import type { RootState } from '@app/state'
import type { AromaItem } from '@entities/aroma/domain/types'

export const selectAroma = (state: RootState): AromaItem | null =>
  state.aroma.selectedAroma
