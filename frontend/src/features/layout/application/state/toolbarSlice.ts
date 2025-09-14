import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  DraftLayoutState,
  BtnToolbar,
} from '../../domain/types/layout.types'

const initialState: DraftLayoutState['toolbar'] = {
  btnToolbar: {
    firstBtn: '',
    secondBtn: '',
    section: '',
  },
  choiceSave: null,
  choiceClip: null,
}

export const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    setBtnToolbar(state, action: PayloadAction<Partial<BtnToolbar>>) {
      state.btnToolbar = {
        ...state.btnToolbar,
        ...action.payload,
      }
    },
    setChoiceSave(state, action: PayloadAction<string | null>) {
      state.choiceSave = action.payload
    },
    setChoiceClip(state, action: PayloadAction<string | null>) {
      state.choiceClip = action.payload
    },
  },
})

export const toolbarActions = toolbarSlice.actions
export default toolbarSlice.reducer
