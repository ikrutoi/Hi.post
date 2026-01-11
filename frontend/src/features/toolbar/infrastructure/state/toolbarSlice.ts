import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  initialCardphotoToolbarState,
  initialSenderToolbarState,
  initialRecipientToolbarState,
  initialCardPanelToolbarState,
  initialCardPanelOverlayToolbarState,
  initialSectionEditorMenuToolbarState,
  UpdateSectionPayload,
  initialCardtextToolbarState,
} from '../../domain/types'
import type { ToolbarState, ToolbarGroup } from '../../domain/types'
import type { IconStateGroup } from '@shared/config/constants'

const initialState: ToolbarState = {
  cardphoto: initialCardphotoToolbarState,
  cardtext: initialCardtextToolbarState,
  sender: initialSenderToolbarState,
  recipient: initialRecipientToolbarState,
  cardPanel: initialCardPanelToolbarState,
  cardPanelOverlay: initialCardPanelOverlayToolbarState,
  sectionEditorMenu: initialSectionEditorMenuToolbarState,
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

    updateToolbarIcon<
      S extends keyof ToolbarState,
      K extends keyof ToolbarState[S],
    >(
      state: ToolbarState,
      action: PayloadAction<{
        section: S
        key: K
        value: ToolbarState[S][K]
      }>
    ) {
      state[action.payload.section][action.payload.key] = action.payload.value
    },

    updateGroupStatus(
      state: ToolbarState,
      action: PayloadAction<{
        section: keyof ToolbarState
        groupName: string
        status: IconStateGroup
      }>
    ) {
      const { section, groupName, status } = action.payload
      const sectionConfig = state[section].config
      if (sectionConfig) {
        const group = sectionConfig.find(
          (g: ToolbarGroup) => g.group === groupName
        )
        if (group) {
          group.status = status
        }
      }
    },

    resetToolbar() {
      return structuredClone(initialState)
    },
  },
})

export const {
  updateToolbarSection,
  updateToolbarIcon,
  updateGroupStatus,
  resetToolbar,
} = toolbarSlice.actions
export default toolbarSlice.reducer
