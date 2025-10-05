import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardCompose } from '../../domain/types/cardCompose.types'

const initialState: CardCompose = {
  cardphoto: {
    isComplete: false,
    data: {
      url: null,
      source: null,
      ui: {
        download: false,
        save: false,
        delete: false,
        turn: false,
        maximize: false,
        crop: false,
        click: null,
      },
    },
  },
  cardtext: {
    isComplete: false,
    data: {
      text: [],
      colorName: '',
      colorType: '',
      font: '',
      fontSize: 0,
      fontStyle: '',
      fontWeight: 400,
      textAlign: 'left',
      lineHeight: null,
      miniCardtextStyle: { maxLines: null, fontSize: null, lineHeight: null },
    },
  },
  envelope: {
    isComplete: false,
    data: {
      sender: { street: '', zip: '', city: '', country: '', name: '' },
      recipient: { street: '', zip: '', city: '', country: '', name: '' },
      ui: {
        miniAddressClose: null,
        envelopeSave: null,
        envelopeSaveSecond: null,
        envelopeRemoveAddress: null,
      },
    },
  },
  aroma: { isComplete: false, data: { make: null, name: null, index: null } },
  date: { isComplete: false, data: { year: null, month: null, day: null } },
}

const cardComposeSlice = createSlice({
  name: 'cardCompose',
  initialState,
  reducers: {
    updateCardCompose(state, action: PayloadAction<Partial<CardCompose>>) {
      Object.assign(state, action.payload)
    },
    resetCardCompose() {
      return initialState
    },
  },
})

export const { updateCardCompose, resetCardCompose } = cardComposeSlice.actions
export default cardComposeSlice.reducer
