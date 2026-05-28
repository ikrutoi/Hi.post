import { createAction } from '@reduxjs/toolkit'

export const applyAllMirrorSectionsCopyRequested = createAction<{
  sourceLocalId: number
}>('cardPanel/applyAllMirrorSectionsCopyRequested')

export const revertAllMirrorSectionsCopyRequested = createAction(
  'cardPanel/revertAllMirrorSectionsCopyRequested',
)
