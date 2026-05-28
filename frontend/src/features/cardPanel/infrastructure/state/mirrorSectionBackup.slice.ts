import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setCardPieCopyStripExpanded, setCartListPanelOpen } from '@cart/infrastructure/state'
import type { CardPanelSection } from '../../domain/types'
import type {
  MirrorSectionBackup,
  MirrorSectionBackupState,
} from '../../domain/types/mirrorSectionBackup.types'

const initialState: MirrorSectionBackupState = {
  bySection: {},
}

const mirrorSectionBackupSlice = createSlice({
  name: 'mirrorSectionBackup',
  initialState,
  reducers: {
    setMirrorSectionBackup(
      state,
      action: PayloadAction<MirrorSectionBackup>,
    ) {
      state.bySection[action.payload.section] = action.payload
    },
    clearMirrorSectionBackup(
      state,
      action: PayloadAction<CardPanelSection>,
    ) {
      delete state.bySection[action.payload]
    },
    clearAllMirrorSectionBackups(state) {
      state.bySection = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setCardPieCopyStripExpanded, (state, action) => {
        if (!action.payload) {
          state.bySection = {}
        }
      })
      .addCase(setCartListPanelOpen, (state, action) => {
        if (!action.payload) {
          state.bySection = {}
        }
      })
  },
})

export const {
  setMirrorSectionBackup,
  clearMirrorSectionBackup,
  clearAllMirrorSectionBackups,
} = mirrorSectionBackupSlice.actions

export default mirrorSectionBackupSlice.reducer
