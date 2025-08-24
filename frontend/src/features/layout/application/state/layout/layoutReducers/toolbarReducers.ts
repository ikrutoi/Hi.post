import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  DraftLayoutState,
  BtnToolbar,
} from '../../../../domain/model/layoutTypes'

export const setBtnToolbar = (
  state: DraftLayoutState,
  action: PayloadAction<Partial<BtnToolbar>>
) => {
  state.btnToolbar = {
    ...state.btnToolbar,
    ...action.payload,
  }
}

export const setChoiceSave = (
  state: DraftLayoutState,
  action: PayloadAction<string | null>
) => {
  state.choiceSave = action.payload
}

export const setChoiceClip = (
  state: DraftLayoutState,
  action: PayloadAction<string | null>
) => {
  state.choiceClip = action.payload
}
