import { AppDispatch, RootState } from '@app/state'
import {
  openFileDialog,
  resetFileDialog,
  cancelFileDialog,
  markLoading,
  markLoaded,
  setNeedsCrop,
} from '../../infrastructure/state/cardphotoUiSlice'
import {
  selectShouldOpenFileDialog,
  selectIsLoading,
  selectNeedsCrop,
} from '../../infrastructure/selectors/cardphotoUiSelectors'

export const useCardphotoUiController = (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const state = {
    shouldOpenFileDialog: selectShouldOpenFileDialog(getState()),
    isLoading: selectIsLoading(getState()),
    needsCrop: selectNeedsCrop(getState()),
  }

  const actions = {
    openFileDialog: () => dispatch(openFileDialog()),
    resetFileDialog: () => dispatch(resetFileDialog()),
    cancelFileDialog: () => dispatch(cancelFileDialog()),
    markLoading: () => dispatch(markLoading()),
    markLoaded: () => dispatch(markLoaded()),
    setNeedsCrop: (flag: boolean) => dispatch(setNeedsCrop(flag)),
  }

  return { state, actions }
}
