import { useStore } from 'react-redux'
import type { RootState } from '@app/state'

export const useSizeSelectors = () => {
  const state = useStore<RootState>().getState().layout.size

  return {
    getSizeCard: () => state.sizeCard,
    getSizeMiniCard: () => state.sizeMiniCard,
    getRemSize: () => state.remSize,
  }
}
