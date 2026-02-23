import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/**
 * Выбор получателей для текущей открытки (мультивыбор, тоггл по клику).
 * Сохраняется в Redux и в IndexedDB (сессия), время до попадания в корзину может быть долгим.
 * Для залогиненных пользователей можно дополнительно синхронизировать на бэкенд (SessionData.envelopeSelection).
 * При формировании корзины: 1 получатель — одна открытка, replicaGroupId = null;
 * N получателей — N открыток с общим replicaGroupId.
 */
export interface EnvelopeSelectionState {
  selectedRecipientIds: string[]
  /** Панель списка получателей открыта по клику на иконку addressList (форма Recipient при этом не отключается). */
  recipientListPanelOpen: boolean
}

const initialState: EnvelopeSelectionState = {
  selectedRecipientIds: [],
  recipientListPanelOpen: false,
}

export const envelopeSelectionSlice = createSlice({
  name: 'envelopeSelection',
  initialState,
  reducers: {
    toggleRecipientSelection(state, action: PayloadAction<string>) {
      const id = action.payload
      const idx = state.selectedRecipientIds.indexOf(id)
      if (idx === -1) {
        state.selectedRecipientIds.push(id)
      } else {
        state.selectedRecipientIds.splice(idx, 1)
      }
    },

    setSelectedRecipientIds(state, action: PayloadAction<string[]>) {
      state.selectedRecipientIds = action.payload
    },

    clearRecipientSelection(state) {
      state.selectedRecipientIds = []
    },

    toggleRecipientListPanel(state) {
      state.recipientListPanelOpen = !state.recipientListPanelOpen
    },

    closeRecipientListPanel(state) {
      state.recipientListPanelOpen = false
    },
  },
})

export const {
  toggleRecipientSelection,
  setSelectedRecipientIds,
  clearRecipientSelection,
  toggleRecipientListPanel,
  closeRecipientListPanel,
} = envelopeSelectionSlice.actions

export default envelopeSelectionSlice.reducer
