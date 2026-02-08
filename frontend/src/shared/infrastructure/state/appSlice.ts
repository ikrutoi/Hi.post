import { RootState } from '@app/state'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  isHydrating: boolean
}

const initialState: AppState = {
  isHydrating: true,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setHydrating: (state, action: PayloadAction<boolean>) => {
      state.isHydrating = action.payload
    },
  },
})

export const { setHydrating } = appSlice.actions
export const selectIsHydrating = (state: RootState) => state.app.isHydrating

export default appSlice.reducer
