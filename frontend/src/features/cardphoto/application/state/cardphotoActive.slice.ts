import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardphotoActiveState } from '../../domain/cardphotoTypes'

const initialState: CardphotoActiveState = {
  activeState: null,
}

const cardphotoActiveSlice = createSlice({
  name: 'cardphotoActive',
  initialState,
  reducers: {
    setCardphotoActive: (
      state,
      action: PayloadAction<string | undefined | null>
    ) => {
      state.activeState = action.payload
    },
  },
})

export const { setCardphotoActive } = cardphotoActiveSlice.actions
export default cardphotoActiveSlice.reducer
