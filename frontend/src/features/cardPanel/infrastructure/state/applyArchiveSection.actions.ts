import { createAction } from '@reduxjs/toolkit'
import type { CardPanelSection } from '../../domain/types'

export const applyArchiveSectionToEditorRequested = createAction<{
  section: CardPanelSection
  sourceLocalId: number
}>('cardPanel/applyArchiveSectionToEditorRequested')
