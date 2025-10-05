import { useStore } from 'react-redux'
import type { RootState } from '@app/state'

export const useUiSelectors = () => {
  const state = useStore<RootState>().getState().layout.ui

  return {
    getIsLoading: () => state.isLoading,
    getError: () => state.error,
    getButtonsVisibility: () => state.buttonsVisible,
    getButtonsLock: () => state.buttonsLocked,
    getTheme: () => state.theme,
    getLayoutMode: () => state.layoutMode,
  }
}
