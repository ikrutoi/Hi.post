import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type CardText = {
  text: {
    type: string
    children: { text: string }[]
  }[]
  colorName: string
  colorType: string
  font: string
  fontSize: number
  fontStyle: string
  fontWeight: number
  textAlign: string
  lineHeight: number | null
  miniCardtextStyle: {
    maxLines: number | null
    fontSize: number | null
    lineHeight: number | null
  }
}

type Address = {
  street: string
  index: string
  city: string
  country: string
  name: string
}

type CardEditState = {
  aroma: string | null
  date: string | null
  cardphoto: {
    url: string | null
    source: string | null
  }
  cardtext: CardText
  envelope: {
    myaddress: Address
    toaddress: Address
  }
}

const initialState: CardEditState = {
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
    addCardphoto: (
      state,
      action: PayloadAction<Partial<CardEditState['cardphoto']>>
    ) => {
      state.cardphoto = { ...state.cardphoto, ...action.payload }
    },
    addCardtext: (
      state,
      action: PayloadAction<Partial<CardEditState['cardtext']>>
    ) => {
      state.cardtext = { ...state.cardtext, ...action.payload }
    },
    addEnvelope: (
      state,
      action: PayloadAction<Partial<CardEditState['envelope']>>
    ) => {
      state.envelope = { ...state.envelope, ...action.payload }
    },
    addDate: (state, action: PayloadAction<string | null>) => {
      state.date = action.payload
    },
    addAroma: (state, action: PayloadAction<string | null>) => {
      state.aroma = action.payload
    },
  },
})

export const { addCardphoto, addCardtext, addEnvelope, addDate, addAroma } =
  cardEditSlice.actions

export default cardEditSlice.reducer
