import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LayoutCartState {
  cartCards: any
  dateCartCards: any
  lockDateCartCards: any
}

const initialState: LayoutCartState = {
  cartCards: null,
  dateCartCards: null,
  lockDateCartCards: null,
}

const layoutCartSlice = createSlice({
  name: 'layoutShopping',
  initialState,
  reducers: {
    setCartCards(state, action: PayloadAction<any>) {
      state.cartCards = action.payload
    },
    setDateCartCards(state, action: PayloadAction<any>) {
      state.dateCartCards = action.payload
    },
    setLockDateCartCards(state, action: PayloadAction<any>) {
      state.lockDateCartCards = action.payload
    },
  },
})

export const { setCartCards, setDateCartCards, setLockDateCartCards } =
  layoutCartSlice.actions
export default layoutCartSlice.reducer
