import { createAction } from '@reduxjs/toolkit'

export const applyAllMirrorSectionsCopyRequested = createAction<{
  sourceLocalId: number
  /** cardPieEdit: гидратация без session-apply у cardphoto (сектор CardPie пустой до Apply). */
  clearCardphotoApplied?: boolean
}>('cardPanel/applyAllMirrorSectionsCopyRequested')

export const revertAllMirrorSectionsCopyRequested = createAction(
  'cardPanel/revertAllMirrorSectionsCopyRequested',
)
