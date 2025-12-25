import { useDispatch, useSelector } from 'react-redux'
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

export const useCardphotoUiFacade = () => {
  const dispatch = useDispatch()

  const state = {
    shouldOpenFileDialog: useSelector(selectShouldOpenFileDialog),
    isLoading: useSelector(selectIsLoading),
    needsCrop: useSelector(selectNeedsCrop),
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
