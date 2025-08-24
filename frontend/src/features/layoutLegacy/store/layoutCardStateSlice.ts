import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FullCardPersonalId } from '@shared/layout/model/layoutTypes'

interface LayoutCardState {
  fullCard: boolean
  addFullCard: boolean
  fullCardPersonalId: FullCardPersonalId
  personalId: string | null
}

const initialState: LayoutCardState = {
  fullCard: false,
  addFullCard: false,
  fullCardPersonalId: { shopping: null, blanks: null },
  personalId: null,
}

const layoutCardStateSlice = createSlice({
  name: 'layoutCardState',
  initialState,
  reducers: {
    setFullCard(state, action: PayloadAction<boolean>) {
      state.fullCard = action.payload
    },
    setAddFullCard(state, action: PayloadAction<boolean>) {
      state.addFullCard = action.payload
    },
    setFullCardPersonalId(
      state,
      action: PayloadAction<Partial<FullCardPersonalId>>
    ) {
      state.fullCardPersonalId = {
        ...state.fullCardPersonalId,
        ...action.payload,
      }
    },
    setPersonalId(state, action: PayloadAction<string | null>) {
      state.personalId = action.payload
    },
  },
})

export const {
  setFullCard,
  setAddFullCard,
  setFullCardPersonalId,
  setPersonalId,
} = layoutCardStateSlice.actions
export default layoutCardStateSlice.reducer
