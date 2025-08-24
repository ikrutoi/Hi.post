import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartState {
  cartCards: any
  dateCartCards: any
  lockDateCartCards: any
}

const initialState: CartState = {
  cartCards: null,
  dateCartCards: null,
  lockDateCartCards: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartCards: (state, action: PayloadAction<any>) => {
      state.cartCards = action.payload
    },
    setDateCartCards: (state, action: PayloadAction<any>) => {
      state.dateCartCards = action.payload
    },
    setLockDateCartCards: (state, action: PayloadAction<any>) => {
      state.lockDateCartCards = action.payload
    },
  },
})

export const { setCartCards, setDateCartCards, setLockDateCartCards } =
  cartSlice.actions
export const cartReducer = cartSlice.reducer
export type { CartState }
