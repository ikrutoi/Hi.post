import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardtextState } from '../../domain/types'

const initialState: CardtextState = {
  text: [{ type: 'paragraph', children: [{ text: '' }] }],
  colorName: 'blueribbon',
  colorType: 'rgba(0, 122, 255, 0.8)',
  font: '',
  fontSize: 10,
  fontStyle: 'italic',
  fontWeight: 500,
  textAlign: 'left',
  lineHeight: null,
  miniCardtextStyle: {
    maxLines: null,
    fontSize: null,
    lineHeight: null,
  },
}

const cardtextSlice = createSlice({
  name: 'cardtext',
  initialState,
  reducers: {
    setCardtext(state, action: PayloadAction<Partial<CardtextState>>) {
      Object.assign(state, action.payload)
    },
  },
})

export const { setCardtext } = cardtextSlice.actions
export default cardtextSlice.reducer
