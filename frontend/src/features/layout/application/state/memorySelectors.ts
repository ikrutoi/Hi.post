import type { RootState } from '@app/state'

export const selectMemoryCrop = (state: RootState) =>
  state.layout.memory.memoryCrop
export const selectChoiceMemorySection = (state: RootState) =>
  state.layout.memory.choiceMemorySection
export const selectExpendMemoryCard = (state: RootState) =>
  state.layout.memory.expendMemoryCard
export const selectLockExpendMemoryCard = (state: RootState) =>
  state.layout.memory.lockExpendMemoryCard
