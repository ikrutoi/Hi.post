export type ToggleSet = {
  save: boolean
  delete: boolean
  clip: boolean
}

export type CardTextState = {
  italic: 'hover' | boolean
  fontSize: boolean
  color: boolean
  left: 'hover' | boolean
  center: boolean
  right: boolean
  justify: boolean
  save: boolean
  delete: boolean
  clip: boolean
}

export type CardPhotoState = {
  download: boolean
  save: boolean
  delete: boolean
  turn: boolean
  maximaze: boolean
  crop: boolean
}

export type InteractionState = {
  miniAddressClose: 'sender' | 'recipient' | null
  navHistory: boolean
  crop: boolean
  italic: boolean
  left: boolean
  download: boolean
  envelopeSave: 'sender' | 'recipient' | null
  envelopeSaveSecond: boolean | null
  envelopeRemoveAddress: boolean | null
  status: {
    shopping: boolean
  }
  fullCard: {
    plus: boolean
    delete: boolean
  }
  envelope: {
    myaddress: ToggleSet
    toaddress: ToggleSet
  }
  cardphoto: CardPhotoState
  cardphotoClick: boolean | null
  cardtext: CardTextState
}
