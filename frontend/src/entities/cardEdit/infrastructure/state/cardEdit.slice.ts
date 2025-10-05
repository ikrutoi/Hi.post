import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  CardEditState,
  CardText,
  Address,
} from '../../domain/types/cardEdit.types'

const initialState: CardEditState = {
  envelope: {
    sender: { street: '', zip: '', city: '', country: '', name: '' },
    recipient: { street: '', zip: '', city: '', country: '', name: '' },
  },
  aroma: null,
  date: null,
  cardphoto: { url: null, source: null },
  cardtext: {
    text: [{ type: 'paragraph', children: [{ text: '' }] }],
    colorName: 'blueribbon',
    colorType: 'rgba(0, 122, 255, 0.8)',
    font: '',
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: 500,
    textAlign: 'left',
    lineHeight: null,
    miniCardtextStyle: { maxLines: null, fontSize: null, lineHeight: null },
  },
}

const cardEditSlice = createSlice({
  name: 'cardEdit',
  initialState,
  reducers: {
    addCardphoto(
      state,
      action: PayloadAction<Partial<CardEditState['cardphoto']>>
    ) {
      state.cardphoto = { ...state.cardphoto, ...action.payload }
    },
    addCardtext(state, action: PayloadAction<Partial<CardText>>) {
      state.cardtext = { ...state.cardtext, ...action.payload }
    },
    addEnvelope(
      state,
      action: PayloadAction<Partial<CardEditState['envelope']>>
    ) {
      state.envelope = { ...state.envelope, ...action.payload }
    },
    addDate(state, action: PayloadAction<string | null>) {
      state.date = action.payload
    },
    addAroma(state, action: PayloadAction<string | null>) {
      state.aroma = action.payload
    },
  },
})

export const { addCardphoto, addCardtext, addEnvelope, addDate, addAroma } =
  cardEditSlice.actions
export default cardEditSlice.reducer
