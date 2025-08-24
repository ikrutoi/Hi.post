import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = { value: null as string | null }

const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<string | null>) => {
      state.value = action.payload
    },
  },
})

export const { setDate } = dateSlice.actions
export const dateReducer = dateSlice.reducer
