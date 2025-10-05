export type LayoutUiState = {
  miniAddressClose: 'sender' | 'recipient' | null
  navHistory: boolean
  envelopeSave: 'sender' | 'recipient' | null
  envelopeSaveSecond: boolean | null
  envelopeRemoveAddress: boolean | null
  cardphotoClick: boolean | null
  status: {
    cart: boolean
  }
}
