import { createAction } from '@reduxjs/toolkit'
import type { CardPanelSection } from '../../domain/types'

export const applyArchiveSectionToEditorRequested = createAction<{
  section: CardPanelSection
  sourceLocalId: number
  clearCardtextApplied?: boolean
  /** Edit: подгрузить фото в asset, session-apply снять (CardPie пустеет). */
  clearCardphotoApplied?: boolean
}>('cardPanel/applyArchiveSectionToEditorRequested')
