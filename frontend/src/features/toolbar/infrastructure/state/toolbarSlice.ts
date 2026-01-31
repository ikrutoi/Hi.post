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
import type {
  ToolbarState,
  ToolbarGroup,
  ToolbarIcon,
  // UpdateIconValue,
  // ToolbarValue,
} from '../../domain/types'
import type {
  IconStateGroup,
  // IconValue,
  IconState,
  UpdateIconPayloadValue,
} from '@shared/config/constants'

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
      action: PayloadAction<UpdateSectionPayload<K>>,
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
        value: IconState | Partial<Omit<ToolbarIcon, 'key'>>
      }>,
    ) {
      const { section, key, value } = action.payload
      const current = state[section][key] as Omit<ToolbarIcon, 'key'>

      if (typeof value === 'string') {
        state[section][key] = {
          ...current,
          state: value,
        } as ToolbarState[S][K]
      } else {
        state[section][key] = {
          ...current,
          ...value,
          options: {
            ...(current?.options || {}),
            ...(value?.options || {}),
          },
        } as ToolbarState[S][K]
      }
    },

    updateGroupStatus(
      state: ToolbarState,
      action: PayloadAction<{
        section: keyof ToolbarState
        groupName: string
        status: IconStateGroup
      }>,
    ) {
      const { section, groupName, status } = action.payload
      console.log('updateGroupStatus +', status)
      const sectionConfig = state[section].config
      if (sectionConfig) {
        const group = sectionConfig.find(
          (g: ToolbarGroup) => g.group === groupName,
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
