import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  navHistory: false,
  crop: false,
  italic: true,
  left: true,
  download: false,
  envelopeSave: null,
  envelopeSaveSecond: null,
  envelopeRemoveAddress: null,
  miniAddressClose: null,
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
    updateButtonsState: (state, action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { updateButtonsState } = infoButtonsSlice.actions
export default infoButtonsSlice.reducer
