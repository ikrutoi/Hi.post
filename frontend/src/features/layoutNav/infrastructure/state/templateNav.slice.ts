import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TemplateNav } from '../../domain/types'
import type { Template } from '@shared/config/constants'

const initialState: TemplateNav = {
  selectedTemplate: null,
}

export const templateNavSlice = createSlice({
  name: 'templateNav',
  initialState,
  reducers: {
    setSelectedTemplate(state, action: PayloadAction<Template>) {
      state.selectedTemplate = action.payload
    },
    clearSelectedTemplate(state) {
      state.selectedTemplate = null
    },
  },
})

export const { setSelectedTemplate, clearSelectedTemplate } =
  templateNavSlice.actions

export default templateNavSlice.reducer
