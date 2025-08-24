import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CardState {
  fullCard: boolean
  addFullCard: boolean
  selectedCard: boolean
  fullCardPersonalId: {
    shopping: string | null
    blanks: string | null
  }
  maxCardsList: number | null
}

const initialState: CardState = {
  fullCard: false,
  addFullCard: false,
  selectedCard: false,
  fullCardPersonalId: { shopping: null, blanks: null },
  maxCardsList: null,
}

const cardStateSlice = createSlice({
  name: 'cardState',
  initialState,
  reducers: {
    setFullCard: (state, action: PayloadAction<boolean>) => {
      state.fullCard = action.payload
    },
    setAddFullCard: (state, action: PayloadAction<boolean>) => {
      state.addFullCard = action.payload
    },
    setSelectedCard: (state, action: PayloadAction<boolean>) => {
      state.selectedCard = action.payload
    },
    setFullCardPersonalId: (
      state,
      action: PayloadAction<Partial<CardState['fullCardPersonalId']>>
    ) => {
      state.fullCardPersonalId = {
        ...state.fullCardPersonalId,
        ...action.payload,
      }
    },
    setMaxCardsList: (state, action: PayloadAction<number | null>) => {
      state.maxCardsList = action.payload
    },
  },
})

export const {
  setFullCard,
  setAddFullCard,
  setSelectedCard,
  setFullCardPersonalId,
  setMaxCardsList,
} = cardStateSlice.actions

export const cardStateReducer = cardStateSlice.reducer
export type { CardState }
