// uiController.ts
import { useDispatch, useSelector } from 'react-redux'
import {
  setLoading,
  setError,
  setButtonsVisibility,
  setButtonsLock,
  setTheme,
  setLayoutMode,
  setSelectedTemplate,
  resetSelectedTemplate,
  updateTemplateState,
} from '../../infrastructure/state'

import {
  selectUiState,
  selectIsLoading,
  selectError,
  selectButtonsVisible,
  selectButtonsLocked,
  selectTheme,
  selectLayoutMode,
  selectSelectedTemplate,
  selectTemplateState,
  selectSelectedSection,
} from '../../infrastructure/selectors'

import type { IconState } from '@shared/types'
import type { Template } from '@shared/config/constants'

export const useUiController = () => {
  const dispatch = useDispatch()

  const selectedTemplate = useSelector(selectSelectedTemplate)
  const templateState = useSelector(selectTemplateState)
  const selectedSection = useSelector(selectSelectedSection)

  const uiState = useSelector(selectUiState)
  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)
  const buttonsVisible = useSelector(selectButtonsVisible)
  const buttonsLocked = useSelector(selectButtonsLocked)
  const theme = useSelector(selectTheme)
  const layoutMode = useSelector(selectLayoutMode)

  const setUiLoading = (value: boolean) => dispatch(setLoading(value))
  const setUiError = (message: string | null) => dispatch(setError(message))
  const toggleButtonsVisibility = (visible: boolean) =>
    dispatch(setButtonsVisibility(visible))
  const toggleButtonsLock = (locked: boolean) =>
    dispatch(setButtonsLock(locked))
  const changeTheme = (theme: 'light' | 'dark') => dispatch(setTheme(theme))
  const changeLayoutMode = (mode: string) => dispatch(setLayoutMode(mode))
  const selectTemplate = (template: Template | null) =>
    dispatch(setSelectedTemplate(template))
  const clearSelectedTemplate = () => dispatch(resetSelectedTemplate())
  const setTemplateIconState = (section: Template, value: IconState) =>
    dispatch(updateTemplateState({ section, value }))

  return {
    state: {
      uiState,
      isLoading,
      error,
      buttonsVisible,
      buttonsLocked,
      theme,
      layoutMode,
      selectedTemplate,
      templateState,
      selectedSection,
    },
    actions: {
      setUiLoading,
      setUiError,
      toggleButtonsVisibility,
      toggleButtonsLock,
      changeTheme,
      changeLayoutMode,
      selectTemplate,
      clearSelectedTemplate,
      setTemplateIconState,
    },
  }
}
