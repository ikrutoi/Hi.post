import { RootState } from '@app/state'

export const selectLayoutUi = (state: RootState) => state.layoutUi
export const selectMiniAddressClose = (state: RootState) =>
  state.layoutUi.miniAddressClose
export const selectNavHistory = (state: RootState) => state.layoutUi.navHistory
export const selectEnvelopeSave = (state: RootState) =>
  state.layoutUi.envelopeSave
export const selectEnvelopeSaveSecond = (state: RootState) =>
  state.layoutUi.envelopeSaveSecond
export const selectEnvelopeRemoveAddress = (state: RootState) =>
  state.layoutUi.envelopeRemoveAddress
export const selectCardphotoClick = (state: RootState) =>
  state.layoutUi.cardphotoClick
export const selectCartStatus = (state: RootState) => state.layoutUi.status.cart
