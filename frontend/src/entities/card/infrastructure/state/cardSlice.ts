import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { rebuildIndex } from '../helpers'
import type { CardState } from '../../domain/types'
import type { CardStatus } from '@entities/postcard'
import type { Postcard } from '@entities/postcard'
import { CardSection } from '@/shared/config/constants'
import type { Draft } from '@reduxjs/toolkit'

function clearProcessedPreviewEntries(state: Draft<CardState>) {
  for (const p of state.cards) {
    if (p.status === 'processed') {
      delete state.calendarPreviewCache[p.card.id]
    }
  }
  delete state.calendarPreviewCache['current_session']
}

function applyProcessedCards(state: Draft<CardState>, next: Postcard[]) {
  clearProcessedPreviewEntries(state)
  state.cards = state.cards.filter((p) => p.status !== 'processed')
  for (const postcard of next) {
    state.cards.push(postcard)
  }
  state.calendarIndex.processed =
    next.length === 0
      ? null
      : {
          cardId: next[0].card.id,
          date: next[0].card.date,
          previewUrl: next[0].card.thumbnailUrl,
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
        state.cards = state.cards.filter((p) => p.status !== 'processed')
        state.calendarIndex.processed = null
      }
    },

    syncProcessedRequest: (state) => state,

    openSection: (state, action: PayloadAction<CardSection | null>) => {
      state.activeSection = action.payload
    },

    setProcessedCard: (state, action: PayloadAction<Postcard>) => {
      applyProcessedCards(state, [action.payload])
    },

    setProcessedCardsFromEditor: (state, action: PayloadAction<Postcard[]>) => {
      applyProcessedCards(state, action.payload)
    },

    changeStatus: (
      state,
      action: PayloadAction<{ id: string; newStatus: CardStatus }>,
    ) => {
      const postcard = state.cards.find(
        (p) => p.card.id === action.payload.id,
      )
      if (postcard) {
        postcard.status = action.payload.newStatus

        if (
          postcard.status !== 'processed' &&
          state.calendarIndex.processed?.cardId === postcard.card.id
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
      const donor = state.cards.find((p) => p.card.id === action.payload)
      const processedCards = state.cards.filter((p) => p.status === 'processed')

      if (donor && processedCards.length > 0) {
        for (const currentProcessed of processedCards) {
          currentProcessed.card = {
            ...currentProcessed.card,
            cardphoto: { ...donor.card.cardphoto },
            cardtext: { ...donor.card.cardtext },
            envelope: { ...donor.card.envelope },
            aroma: { ...donor.card.aroma },
            thumbnailUrl: donor.card.thumbnailUrl,
          }
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
      const donor = state.cards.find(
        (p) => p.card.id === action.payload.donorId,
      )
      const processedCards = state.cards.filter((p) => p.status === 'processed')
      const section = action.payload.section

      if (donor && processedCards.length > 0) {
        for (const currentProcessed of processedCards) {
          currentProcessed.card = {
            ...currentProcessed.card,
            [section]: donor.card[section],
          }

          if (section === 'cardphoto') {
            currentProcessed.card.thumbnailUrl = donor.card.thumbnailUrl
          }
        }
      }
    },

    clearProcessed: (state) => {
      clearProcessedPreviewEntries(state)
      state.cards = state.cards.filter((p) => p.status !== 'processed')
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
