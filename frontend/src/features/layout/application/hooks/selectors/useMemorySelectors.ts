import { useStore } from 'react-redux'
import type { RootState } from '@app/state'

export const useMemorySelectors = () => {
  const state = useStore<RootState>().getState().layout.memory

  return {
    getMemoryCrop: () => state.memoryCrop,
    // getChoiceMemorySection: () => state.choiceMemorySection,
    getExpendMemoryCard: () => state.expendMemoryCard,
    getLockExpendMemoryCard: () => state.lockExpendMemoryCard,
  }
}
