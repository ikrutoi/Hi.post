import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { InteractionState } from './types'

const initialState: InteractionState = {
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

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateInteractionState(
      state,
      action: PayloadAction<Partial<InteractionState>>
    ) {
      return { ...state, ...action.payload }
    },
  },
})

export const { updateInteractionState } = interactionSlice.actions
export const interactionReducer = interactionSlice.reducer
export default interactionSlice.reducer
