import React from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import { CardStatus } from '@entities/card/domain/types'
import { selectCardEditorState } from '@entities/cardEditor/infrastructure/selectors'
import { selectCardtextSessionData } from '@cardtext/infrastructure/selectors'
import {
  selectCardphotoPreview,
  selectCardphotoSessionRecord,
} from '@cardphoto/infrastructure/selectors'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import { selectSelectedDate } from '@date/infrastructure/selectors'
import { selectEnvelopeSessionRecord } from '@features/envelope/infrastructure/selectors'

export const selectPieDataByContext = createSelector(
  [
    (state: RootState) => state,
    (_state, status: CardStatus) => status,
    (_state, _status, id?: string) => id,
  ],
  (state, status, id) => {
    if (status === 'processed') {
      return selectCardEditorState(state)
    }

    let cardBase = null
    if (id) {
      // if (status === 'cart') cardBase = selectCartItemById(state, id)
      // if (status === 'sent') cardBase = selectHistoryItemById(state, id)
      // Добавь сюда 'drafts' или 'templates', когда они появятся
    }

    if (!cardBase) return null

    return cardBase
  },
)

export const selectActiveCardFullData = createSelector(
  [
    selectCardEditorState,
    selectCardtextSessionData,
    selectCardphotoPreview,
    selectSelectedAroma,
    selectSelectedDate,
    selectEnvelopeSessionRecord,
  ],
  (editor, cardtext, cardphoto, aroma, date, envelope) => ({
    ...editor,
    data: {
      cardphoto,
      cardtext,
      recipient: envelope.isComplete ? envelope.recipient.data : null,
      aroma,
      date,
    },
  }),
)

export const selectCardFromArchive = createSelector(
  [
    (state: RootState) => state,
    (_state, id?: string) => id,
    (_state, _id, status?: CardStatus) => status,
  ],
  (state, id, status) => {
    if (!id) return null

    switch (status) {
      case 'cart':
        return null
      case 'sent':
        return null
      case 'drafts':
        return null
      default:
        return null
    }
  },
)
