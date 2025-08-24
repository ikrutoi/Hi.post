import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type BtnToolbar = {
  firstBtn: string | null
  secondBtn: string | null
  section: string | null
}

const initialState: BtnToolbar = {
  firstBtn: null,
  secondBtn: null,
  section: null,
}

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    setBtnToolbar: (state, action: PayloadAction<Partial<BtnToolbar>>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setBtnToolbar } = toolbarSlice.actions
export const toolbarReducer = toolbarSlice.reducer
export type { BtnToolbar }
