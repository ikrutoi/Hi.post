import { createSlice } from '@reduxjs/toolkit'
import type { SwitcherState } from '../../domain/types'

const initialState: SwitcherState = {
  position: 'month',
}

export const switcherSlice = createSlice({
  name: 'switcher',
  initialState,
  reducers: {
    togglePosition(state) {
      state.position = state.position === 'month' ? 'year' : 'month'
    },
    setPosition(state, action: { payload: 'month' | 'year' }) {
      state.position = action.payload
    },
  },
})

export const { togglePosition, setPosition } = switcherSlice.actions
export default switcherSlice.reducer
