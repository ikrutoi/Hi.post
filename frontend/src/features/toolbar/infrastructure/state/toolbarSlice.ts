import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  initialCardphotoToolbarState,
  // initialCardtextToolbarState,
  initialSenderToolbarState,
  initialRecipientToolbarState,
  initialCardPanelToolbarState,
  initialCardPanelOverlayToolbarState,
  UpdateSectionPayload,
} from '../../domain/types'
import { initialCardtextToolbarState } from '@cardtext/domain/types'
import type { ToolbarState } from '../../domain/types'

const initialState: ToolbarState = {
  cardphoto: initialCardphotoToolbarState,
  cardtext: initialCardtextToolbarState,
  sender: initialSenderToolbarState,
  recipient: initialRecipientToolbarState,
  cardPanel: initialCardPanelToolbarState,
  cardPanelOverlay: initialCardPanelOverlayToolbarState,
}

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    updateToolbarSection<K extends keyof ToolbarState>(
      state: ToolbarState,
      action: PayloadAction<UpdateSectionPayload<K>>
    ) {
      Object.assign(state[action.payload.section], action.payload.value)
    },
    resetToolbar() {
      return structuredClone(initialState)
    },
  },
})

export const { updateToolbarSection, resetToolbar } = toolbarSlice.actions
export default toolbarSlice.reducer
