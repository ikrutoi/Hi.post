import { useAppDispatch, useAppSelector } from '@/app/hooks'
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
  const dispatch = useAppDispatch()

  const state = {
    shouldOpenFileDialog: useAppSelector(selectShouldOpenFileDialog),
    isLoading: useAppSelector(selectIsLoading),
    needsCrop: useAppSelector(selectNeedsCrop),
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
