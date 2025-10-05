import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'

export const selectCardEdit = (state: RootState) => state.cardEdit

export const selectCardPhoto = createSelector(
  selectCardEdit,
  (state) => state.cardphoto
)

export const selectCardText = createSelector(
  selectCardEdit,
  (state) => state.cardtext
)

export const selectEnvelope = createSelector(
  selectCardEdit,
  (state) => state.envelope
)

export const selectCardDate = createSelector(
  selectCardEdit,
  (state) => state.date
)

export const selectCardAroma = createSelector(
  selectCardEdit,
  (state) => state.aroma
)
