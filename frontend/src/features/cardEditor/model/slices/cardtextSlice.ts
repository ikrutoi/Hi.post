import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Cardtext } from '../types/Cardtext'

const initialState: Cardtext = {
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
}

const cardtextSlice = createSlice({
  name: 'cardText',
  initialState,
  reducers: {
    setCardtext: (state, action: PayloadAction<Partial<Cardtext>>) => ({
      ...state,
      ...action.payload,
    }),
  },
})

export const { setCardtext } = cardtextSlice.actions
export const cardtextReducer = cardtextSlice.reducer
