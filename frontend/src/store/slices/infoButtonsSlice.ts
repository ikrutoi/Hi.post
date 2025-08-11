import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ToggleSet = {
  save: boolean
  delete: boolean
  clip: boolean
}

type CardTextState = {
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

type CardPhotoState = {
  download: boolean
  save: boolean
  delete: boolean
  turn: boolean
  maximaze: boolean
  crop: boolean
}

type InfoButtonsState = {
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

const initialState: InfoButtonsState = {
  miniAddressClose: null,
  navHistory: false,
  crop: false,
  italic: true,
  left: true,
  download: false,
  envelopeSave: null,
  envelopeSaveSecond: null,
  envelopeRemoveAddress: null,
  status: { shopping: false },
  fullCard: { plus: false, delete: false },
  envelope: {
    myaddress: { save: false, delete: false, clip: false },
    toaddress: { save: false, delete: false, clip: false },
  },
  cardphoto: {
    download: true,
    save: false,
    delete: false,
    turn: true,
    maximaze: false,
    crop: true,
  },
  cardphotoClick: null,
  cardtext: {
    italic: 'hover',
    fontSize: true,
    color: true,
    left: 'hover',
    center: true,
    right: true,
    justify: true,
    save: false,
    delete: false,
    clip: false,
  },
}

const infoButtonsSlice = createSlice({
  name: 'infoButtons',
  initialState,
  reducers: {
    updateButtonsState: (
      state,
      action: PayloadAction<Partial<InfoButtonsState>>
    ) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { updateButtonsState } = infoButtonsSlice.actions
export default infoButtonsSlice.reducer
