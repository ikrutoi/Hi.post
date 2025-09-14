import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  BtnToolbar,
  ActiveSections,
} from 'shared-legacy/layoutLegacy/model/layoutTypes'

interface LayoutToolbarState {
  btnToolbar: BtnToolbar
  activeSections: ActiveSections
}

const initialState: LayoutToolbarState = {
  btnToolbar: { firstBtn: null, secondBtn: null, section: null },
  activeSections: {
    cardphoto: false,
    cardtext: false,
    envelope: false,
    date: false,
    aroma: false,
  },
}

const layoutToolbarSlice = createSlice({
  name: 'layoutToolbar',
  initialState,
  reducers: {
    setBtnToolbar(state, action: PayloadAction<Partial<BtnToolbar>>) {
      state.btnToolbar = { ...state.btnToolbar, ...action.payload }
    },
    setActiveSections(state, action: PayloadAction<Partial<ActiveSections>>) {
      state.activeSections = { ...state.activeSections, ...action.payload }
    },
  },
})

export const { setBtnToolbar, setActiveSections } = layoutToolbarSlice.actions
export default layoutToolbarSlice.reducer
