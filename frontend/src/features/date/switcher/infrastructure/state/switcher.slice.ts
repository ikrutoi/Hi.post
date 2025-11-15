import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Switcher, VisibleCalendarDate } from '@entities/date/domain/types'

interface SwitcherState {
  active: Switcher
}

const initialState: SwitcherState = {
  active: null,
}

export const switcherSlice = createSlice({
  name: 'switcher',
  initialState,
  reducers: {
    setSwitcher(state, action: PayloadAction<Switcher>) {
      state.active = action.payload
    },
    toggleSwitcher(state, action: PayloadAction<VisibleCalendarDate>) {
      state.active = state.active === action.payload ? null : action.payload
    },
    resetSwitcher(state) {
      state.active = null
    },
  },
})

export const { setSwitcher, toggleSwitcher, resetSwitcher } =
  switcherSlice.actions

export default switcherSlice.reducer
