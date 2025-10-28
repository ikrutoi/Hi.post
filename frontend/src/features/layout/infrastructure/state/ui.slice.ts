import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TEMPLATES } from '@shared/config/constants'
import type { Template } from '@shared/config/constants'
import type { IconState } from '@shared/types'
import type { UiState, TemplateState } from '../../domain/types'

const initialTemplateState: TemplateState = TEMPLATES.reduce((acc, section) => {
  acc[section] = 'disabled'
  return acc
}, {} as TemplateState)

const initialState: UiState = {
  selectedTemplate: null,
  templateState: initialTemplateState,
  selectedSection: null,

  isLoading: false,
  error: null,
  buttonsVisible: true,
  buttonsLocked: false,
  theme: 'light',
  layoutMode: 'default',
  // selectedTemplateSection: null,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setButtonsVisibility(state, action: PayloadAction<boolean>) {
      state.buttonsVisible = action.payload
    },
    setButtonsLock(state, action: PayloadAction<boolean>) {
      state.buttonsLocked = action.payload
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload
    },
    setLayoutMode(state, action: PayloadAction<string>) {
      state.layoutMode = action.payload
    },
    setSelectedTemplate(state, action: PayloadAction<Template | null>) {
      state.selectedTemplate = action.payload
    },
    resetSelectedTemplate(state) {
      state.selectedTemplate = null
    },
    updateTemplateState(
      state,
      action: PayloadAction<{
        section: Template
        value: IconState
      }>
    ) {
      const { section, value } = action.payload
      state.templateState[section] = value
    },
  },
})

export const {
  setLoading,
  setError,
  setButtonsVisibility,
  setButtonsLock,
  setTheme,
  setLayoutMode,
  setSelectedTemplate,
  resetSelectedTemplate,
  updateTemplateState,
} = uiSlice.actions

export default uiSlice.reducer
