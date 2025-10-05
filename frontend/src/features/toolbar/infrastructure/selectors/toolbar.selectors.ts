import { RootState } from '@app/state'

export const selectToolbar = (state: RootState) => state.toolbar
export const selectCardphotoToolbar = (state: RootState) =>
  state.toolbar.cardphoto
export const selectCardtextToolbar = (state: RootState) =>
  state.toolbar.cardtext
export const selectEnvelopeToolbar = (state: RootState) =>
  state.toolbar.envelope
export const selectFullCardToolbar = (state: RootState) =>
  state.toolbar.fullCard
