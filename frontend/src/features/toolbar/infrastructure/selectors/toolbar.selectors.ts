import { RootState } from '@app/state'

export const selectToolbar = (state: RootState) => state.toolbar
export const selectCardphotoToolbar = (state: RootState) =>
  state.toolbar.cardphoto
export const selectCardtextToolbar = (state: RootState) =>
  state.toolbar.cardtext
export const selectSenderToolbar = (state: RootState) => state.toolbar.sender
export const selectRecipientToolbar = (state: RootState) =>
  state.toolbar.recipient
