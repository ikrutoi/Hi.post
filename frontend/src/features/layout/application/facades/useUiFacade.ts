// useUiFacade.ts
import { useMemo } from 'react'
import { useUiController } from '../controllers'
import type { Template } from '@shared/config/constants'
import type { IconState } from '@shared/types'

export const useUiFacade = () => {
  const { state, actions } = useUiController()

  const {
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
  } = state

  const {
    setUiLoading,
    setUiError,
    toggleButtonsVisibility,
    toggleButtonsLock,
    changeTheme,
    changeLayoutMode,
    selectTemplate,
    clearSelectedTemplate,
    setTemplateIconState,
  } = actions

  const isDarkTheme = theme === 'dark'
  const isCompactLayout = layoutMode === 'compact'

  const isSectionActive = useMemo(() => {
    if (!selectedTemplate) return false
    return templateState[selectedTemplate] === 'active'
  }, [selectedTemplate, templateState])

  const getSectionState = (section: Template): IconState =>
    templateState[section]

  const setSectionState = (section: Template, value: IconState) =>
    setTemplateIconState(section, value)

  return {
    ui: {
      selectedTemplate,
      templateState,
      selectedSection,

      uiState,
      isLoading,
      error,
      buttonsVisible,
      buttonsLocked,
      theme,
      layoutMode,
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
      setSectionState,
    },
    computed: {
      isDarkTheme,
      isCompactLayout,
      isSectionActive,
      getSectionState,
    },
  }
}
