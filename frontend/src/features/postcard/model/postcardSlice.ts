import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { PostcardState, Cardtext, Address } from './types'

const initialState: PostcardState = {
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
  envelope: {
    sender: { street: '', zip: '', city: '', country: '', name: '' },
    recipient: { street: '', zip: '', city: '', country: '', name: '' },
  },
}

const postcardSlice = createSlice({
  name: 'postcard',
  initialState,
  reducers: {
    setCardphoto(
      state,
      action: PayloadAction<Partial<PostcardState['cardphoto']>>
    ) {
      state.cardphoto = { ...state.cardphoto, ...action.payload }
    },
    setCardtext(state, action: PayloadAction<Partial<Cardtext>>) {
      state.cardtext = { ...state.cardtext, ...action.payload }
    },
    setEnvelope(
      state,
      action: PayloadAction<Partial<PostcardState['envelope']>>
    ) {
      state.envelope = { ...state.envelope, ...action.payload }
    },
    setDate(state, action: PayloadAction<string | null>) {
      state.date = action.payload
    },
    setAroma(state, action: PayloadAction<string | null>) {
      state.aroma = action.payload
    },
  },
})

export const { setCardphoto, setCardtext, setEnvelope, setDate, setAroma } =
  postcardSlice.actions

export const postcardReducer = postcardSlice.reducer
export default postcardSlice.reducer
