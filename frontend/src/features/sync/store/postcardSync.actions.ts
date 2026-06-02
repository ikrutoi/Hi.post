import { createAction } from '@reduxjs/toolkit'

export const rehydratePostcardsFromIdb = createAction(
  'postcardSync/rehydratePostcardsFromIdb',
)

export const postcardLocalDataChanged = createAction(
  'postcardSync/postcardLocalDataChanged',
)
