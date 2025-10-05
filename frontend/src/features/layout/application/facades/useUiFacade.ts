import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  getIsLoading,
  getError,
  getButtonsVisibility,
  getButtonsLock,
  getTheme,
  getLayoutMode,
} from '../../infrastructure/selectors'
import { uiController } from '../../application/controllers'

export const useUiFacade = () => {
  const dispatch = useAppDispatch()

  const isLoading = useAppSelector(getIsLoading)
  const error = useAppSelector(getError)
  const buttonsVisible = useAppSelector(getButtonsVisibility)
  const buttonsLocked = useAppSelector(getButtonsLock)
  const theme = useAppSelector(getTheme)
  const layoutMode = useAppSelector(getLayoutMode)

  const {
    setIsLoading,
    setError,
    setButtonsVisibility,
    setButtonsLock,
    setTheme,
    setLayoutMode,
  } = uiController(dispatch)

  return {
    ui: {
      isLoading,
      error,
      buttonsVisible,
      buttonsLocked,
      theme,
      layoutMode,
    },
    actions: {
      setIsLoading,
      setError,
      setButtonsVisibility,
      setButtonsLock,
      setTheme,
      setLayoutMode,
    },
  }
}
