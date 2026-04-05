import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { rebuildIndex } from '../helpers'
import type { Card, CardState, CardStatus } from '../../domain/types'
import { CardSection } from '@/shared/config/constants'
import type { Draft } from '@reduxjs/toolkit'

function clearProcessedPreviewEntries(state: Draft<CardState>) {
  for (const c of state.cards) {
    if (c.status === 'processed') {
      delete state.calendarPreviewCache[c.id]
    }
  }
  delete state.calendarPreviewCache['current_session']
}

function applyProcessedCards(state: Draft<CardState>, next: Card[]) {
  clearProcessedPreviewEntries(state)
  state.cards = state.cards.filter((c) => c.status !== 'processed')
  for (const card of next) {
    state.cards.push(card)
  }
  state.calendarIndex.processed =
    next.length === 0
      ? null
      : {
          cardId: next[0].id,
          date: next[0].date,
          previewUrl: next[0].thumbnailUrl,
          status: 'processed',
        }
  state.isReady = next.length > 0
}

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
  calendarPreviewCache: {},
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
        clearProcessedPreviewEntries(state)
        state.cards = state.cards.filter((c) => c.status !== 'processed')
        state.calendarIndex.processed = null
      }
    },

    syncProcessedRequest: (state) => state,

    openSection: (state, action: PayloadAction<CardSection | null>) => {
      state.activeSection = action.payload
    },

    setProcessedCard: (state, action: PayloadAction<Card>) => {
      applyProcessedCards(state, [action.payload])
    },

    setProcessedCardsFromEditor: (state, action: PayloadAction<Card[]>) => {
      applyProcessedCards(state, action.payload)
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
      const processedCards = state.cards.filter((c) => c.status === 'processed')

      if (donor && processedCards.length > 0) {
        for (const currentProcessed of processedCards) {
          currentProcessed.cardphoto = { ...donor.cardphoto }
          currentProcessed.cardtext = { ...donor.cardtext }
          currentProcessed.envelope = { ...donor.envelope }
          currentProcessed.aroma = { ...donor.aroma }
          currentProcessed.thumbnailUrl = donor.thumbnailUrl
        }

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
      const processedCards = state.cards.filter((c) => c.status === 'processed')

      if (donor && processedCards.length > 0) {
        for (const currentProcessed of processedCards) {
          ;(currentProcessed as any)[action.payload.section] =
            donor[action.payload.section]

          if (action.payload.section === 'cardphoto') {
            currentProcessed.thumbnailUrl = donor.thumbnailUrl
          }
        }
      }
    },

    clearProcessed: (state) => {
      clearProcessedPreviewEntries(state)
      state.cards = state.cards.filter((c) => c.status !== 'processed')
      state.calendarIndex.processed = null
      state.isReady = false
    },

    setCalendarPreviewCached: (
      state,
      action: PayloadAction<{ cardId: string; blobUrl: string }>,
    ) => {
      state.calendarPreviewCache[action.payload.cardId] = action.payload.blobUrl
    },

    clearCalendarPreviewCache: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      if (action.payload != null) {
        delete state.calendarPreviewCache[action.payload]
      } else {
        state.calendarPreviewCache = {}
      }
    },
  },
})

export const {
  setCardReadyStatus,
  syncProcessedRequest,
  openSection,
  setProcessedCard,
  setProcessedCardsFromEditor,
  changeStatus,
  setPreviewCardId,
  copyFullCardToProcessed,
  copySectionToProcessed,
  clearProcessed,
  setCalendarPreviewCached,
  clearCalendarPreviewCache,
} = cardSlice.actions

export default cardSlice.reducer

export const requestCalendarPreview = createAction<{
  cardId: string
  previewUrl: string
}>('card/requestCalendarPreview')

export const cardActions = {
  ...cardSlice.actions,
  requestFullCopy: createAction<string>('card/requestFullCopy'),
  requestCalendarPreview,
}
