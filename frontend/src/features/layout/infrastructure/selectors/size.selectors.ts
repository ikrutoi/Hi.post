import type { RootState } from '@app/state'

export const selectSizeCard = (state: RootState) => state.layout.size.sizeCard
export const selectSizeMiniCard = (state: RootState) =>
  state.layout.size.sizeMiniCard
export const selectRemSize = (state: RootState) => state.layout.size.remSize
