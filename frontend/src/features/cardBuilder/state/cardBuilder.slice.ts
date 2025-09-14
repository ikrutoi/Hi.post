import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardBuilderState } from '../types/cardBuilder.types'
import type { DateState } from '@features/date/types'

const initialState: CardBuilderState = {
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

const cardBuilderSlice = createSlice({
  name: 'cardBuilder',
  initialState,
  reducers: {
    setCardphoto: (
      state,
      action: PayloadAction<Partial<CardBuilderState['cardphoto']>>
    ) => {
      state.cardphoto = { ...state.cardphoto, ...action.payload }
    },
    setCardtext: (
      state,
      action: PayloadAction<Partial<CardBuilderState['cardtext']>>
    ) => {
      state.cardtext = { ...state.cardtext, ...action.payload }
    },
    setEnvelope: (
      state,
      action: PayloadAction<Partial<CardBuilderState['envelope']>>
    ) => {
      state.envelope = { ...state.envelope, ...action.payload }
    },
    setDate: (state, action: PayloadAction<DateState>) => {
      state.date = action.payload
    },
    setAroma: (state, action: PayloadAction<string | null>) => {
      state.aroma = action.payload
    },
  },
})

export const { setCardphoto, setCardtext, setEnvelope, setDate, setAroma } =
  cardBuilderSlice.actions

export default cardBuilderSlice.reducer
