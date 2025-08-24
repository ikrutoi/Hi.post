import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = { value: null as string | null }

const aromaSlice = createSlice({
  name: 'aroma',
  initialState,
  reducers: {
    setAroma: (state, action: PayloadAction<string | null>) => {
      state.value = action.payload
    },
  },
})

export const { setAroma } = aromaSlice.actions
export const aromaReducer = aromaSlice.reducer
