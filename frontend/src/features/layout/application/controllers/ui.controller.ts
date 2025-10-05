import { AppDispatch } from '@app/state'
import {
  setLoading,
  setError,
  setButtonsVisibility,
  setButtonsLock,
  setTheme,
  setLayoutMode,
} from '../../infrastructure/state/ui.slice'

export const uiController = (dispatch: AppDispatch) => ({
  setIsLoading: (value: boolean) => dispatch(setLoading(value)),
  setError: (message: string | null) => dispatch(setError(message)),
  setButtonsVisibility: (isVisible: boolean) =>
    dispatch(setButtonsVisibility(isVisible)),
  setButtonsLock: (isLocked: boolean) => dispatch(setButtonsLock(isLocked)),
  setTheme: (value: 'light' | 'dark') => dispatch(setTheme(value)),
  setLayoutMode: (mode: string) => dispatch(setLayoutMode(mode)),
})
