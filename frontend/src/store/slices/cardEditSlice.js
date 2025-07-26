import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  aroma: null,
  date: null,
  cardphoto: { url: null, source: null },
  cardtext: {
    text: [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
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
    myaddress: { street: '', index: '', city: '', country: '', name: '' },
    toaddress: { street: '', index: '', city: '', country: '', name: '' },
  },
}

const cardEditSlice = createSlice({
  name: 'cardEdit',
  initialState,
  reducers: {
    addCardphoto: (state, action) => {
      state.cardphoto = { ...state.cardphoto, ...action.payload }
    },
    addCardtext: (state, action) => {
      state.cardtext = { ...state.cardtext, ...action.payload }
    },
    addEnvelope: (state, action) => {
      state.envelope = { ...state.envelope, ...action.payload }
    },
    addDate: (state, action) => {
      state.date = action.payload
    },
    addAroma: (state, action) => {
      state.aroma = action.payload
    },
  },
})

export const { addCardphoto, addCardtext, addEnvelope, addDate, addAroma } =
  cardEditSlice.actions

export default cardEditSlice.reducer
