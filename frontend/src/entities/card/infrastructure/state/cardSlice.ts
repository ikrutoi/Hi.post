import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { rebuildIndex } from '../helpers'
import type { Card, CardState, CardStatus } from '../../domain/types'
import { CardSection } from '@/shared/config/constants'

const initialState: CardState = {
  cards: [],
  calendarIndex: {
    processed: null,
    cart: [],
    ready: [],
    sent: [],
    delivered: [],
    error: [],
  },
  activeSection: null,
  isReady: false,
  previewCardId: null,
}

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    setCardReadyStatus: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload
      if (!action.payload) {
        state.calendarIndex.processed = null
      }
    },

    syncProcessedRequest: (state) => state,

    openSection: (state, action: PayloadAction<CardSection | null>) => {
      state.activeSection = action.payload
    },

    setProcessedCard: (state, action: PayloadAction<Card>) => {
      const index = state.cards.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) state.cards[index] = action.payload
      else state.cards.push(action.payload)

      state.calendarIndex.processed = {
        cardId: action.payload.id,
        date: action.payload.date,
        previewUrl: action.payload.thumbnailUrl,
        status: action.payload.status,
      }
      state.isReady = true
    },

    changeStatus: (
      state,
      action: PayloadAction<{ id: string; newStatus: CardStatus }>,
    ) => {
      const card = state.cards.find((c) => c.id === action.payload.id)
      if (card) {
        card.status = action.payload.newStatus

        if (
          card.status !== 'processed' &&
          state.calendarIndex.processed?.cardId === card.id
        ) {
          state.calendarIndex.processed = null
        }

        rebuildIndex(state)
      }
    },

    setPreviewCardId: (state, action: PayloadAction<string | null>) => {
      state.previewCardId = action.payload
    },

    copyFullCardToProcessed: (state, action: PayloadAction<string>) => {
      const donor = state.cards.find((c) => c.id === action.payload)
      const currentProcessed = state.cards.find((c) => c.status === 'processed')

      if (donor && currentProcessed) {
        currentProcessed.cardphoto = { ...donor.cardphoto }
        currentProcessed.cardtext = { ...donor.cardtext }
        currentProcessed.envelope = { ...donor.envelope }
        currentProcessed.aroma = { ...donor.aroma }
        currentProcessed.thumbnailUrl = donor.thumbnailUrl

        state.previewCardId = null
      }
    },

    copySectionToProcessed: (
      state,
      action: PayloadAction<{
        donorId: string
        section: CardSection
      }>,
    ) => {
      const donor = state.cards.find((c) => c.id === action.payload.donorId)
      const currentProcessed = state.cards.find((c) => c.status === 'processed')

      if (donor && currentProcessed) {
        ;(currentProcessed as any)[action.payload.section] =
          donor[action.payload.section]

        if (action.payload.section === 'cardphoto') {
          currentProcessed.thumbnailUrl = donor.thumbnailUrl
        }
      }
    },

    clearProcessed: (state) => {
      state.calendarIndex.processed = null
      state.isReady = false
    },
  },
})

export const {
  setCardReadyStatus,
  syncProcessedRequest,
  openSection,
  setProcessedCard,
  changeStatus,
  setPreviewCardId,
  copyFullCardToProcessed,
  copySectionToProcessed,
  clearProcessed,
} = cardSlice.actions

export default cardSlice.reducer

export const cardActions = {
  ...cardSlice.actions,
  requestFullCopy: createAction<string>('card/requestFullCopy'),
}
