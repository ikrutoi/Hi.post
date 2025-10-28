import { RootState } from '@app/state'
import type { Template } from '@shared/config/constants'

export const getSelectedTemplate = (state: RootState): Template | null =>
  state.templateNav.selectedTemplate
