import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'

const MAX_PREVIEW_ORDER = CARD_SCALE_CONFIG.maxPreviewToolbarRight

export type AddressTemplateRef = {
  type: 'sender' | 'recipient'
  id: string
}

export interface PreviewStripOrderState {
  cardtextTemplateIds: string[]
  addressTemplateRefs: AddressTemplateRef[]
  addressTemplatesReloadVersion: number
}

const initialState: PreviewStripOrderState = {
  cardtextTemplateIds: [],
  addressTemplateRefs: [],
  addressTemplatesReloadVersion: 0,
}

export const previewStripOrderSlice = createSlice({
  name: 'previewStripOrder',
  initialState,
  reducers: {
    addCardtextTemplateId(state, action: PayloadAction<string>) {
      const id = action.payload
      state.cardtextTemplateIds = state.cardtextTemplateIds.filter(
        (existing) => existing !== id,
      )
      state.cardtextTemplateIds.push(id)
      if (state.cardtextTemplateIds.length > MAX_PREVIEW_ORDER) {
        state.cardtextTemplateIds =
          state.cardtextTemplateIds.slice(-MAX_PREVIEW_ORDER)
      }
    },

    removeCardtextTemplateId(state, action: PayloadAction<string>) {
      state.cardtextTemplateIds = state.cardtextTemplateIds.filter(
        (id) => id !== action.payload,
      )
    },

    addAddressTemplateRef(state, action: PayloadAction<AddressTemplateRef>) {
      const ref = action.payload
      state.addressTemplateRefs = state.addressTemplateRefs.filter(
        (r) => !(r.type === ref.type && r.id === ref.id),
      )
      state.addressTemplateRefs.push(ref)
      if (state.addressTemplateRefs.length > MAX_PREVIEW_ORDER) {
        state.addressTemplateRefs =
          state.addressTemplateRefs.slice(-MAX_PREVIEW_ORDER)
      }
    },

    removeAddressTemplateRef(state, action: PayloadAction<AddressTemplateRef>) {
      const { type, id } = action.payload
      state.addressTemplateRefs = state.addressTemplateRefs.filter(
        (r) => !(r.type === type && r.id === id),
      )
    },

    restorePreviewStripOrder(
      state,
      action: PayloadAction<Partial<PreviewStripOrderState>>,
    ) {
      if (action.payload.cardtextTemplateIds !== undefined)
        state.cardtextTemplateIds = action.payload.cardtextTemplateIds
      if (action.payload.addressTemplateRefs !== undefined)
        state.addressTemplateRefs = action.payload.addressTemplateRefs
    },

    incrementAddressTemplatesReloadVersion(state) {
      state.addressTemplatesReloadVersion += 1
    },
  },
})

export const {
  addCardtextTemplateId,
  removeCardtextTemplateId,
  addAddressTemplateRef,
  removeAddressTemplateRef,
  restorePreviewStripOrder,
  incrementAddressTemplatesReloadVersion,
} = previewStripOrderSlice.actions

export default previewStripOrderSlice.reducer
