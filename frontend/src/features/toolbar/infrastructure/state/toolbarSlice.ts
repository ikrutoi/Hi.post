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
      const { section, value } = action.payload

      Object.assign(state[section], value)

      const sectionData = state[section] as any
      if (sectionData.config) {
        sectionData.config = sectionData.config.map((group: ToolbarGroup) => ({
          ...group,
          icons: group.icons.map((icon) => {
            const update = (value as any)[icon.key]
            if (update) {
              return {
                ...icon,
                state:
                  typeof update === 'string'
                    ? update
                    : update.state || icon.state,
                options: update.options
                  ? { ...icon.options, ...update.options }
                  : icon.options,
              }
            }
            return icon
          }),
        }))
      }
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
      const current = state[section][key] as any
      // console.log('updateToolbarIcon ', action.payload, action.type)

      const newValue =
        typeof value === 'string'
          ? { ...current, state: value }
          : {
              ...current,
              ...value,
              options: { ...current?.options, ...value?.options },
            }

      state[section][key] = newValue

      const sectionData = state[section] as any
      if (sectionData.config) {
        sectionData.config.forEach((group: ToolbarGroup) => {
          const icon = group.icons.find((i) => i.key === key)
          if (icon) {
            icon.state = newValue.state
            icon.options = newValue.options
          }
        })
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
      // console.log('updateGroupStatus +', action.payload)
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
