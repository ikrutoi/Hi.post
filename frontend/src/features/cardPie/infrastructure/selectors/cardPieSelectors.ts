import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import { CardStatus } from '@entities/card/domain/types'
import { selectCardEditorState } from '@entities/cardEditor/infrastructure/selectors'
import { selectCardtextAppliedSessionData } from '@cardtext/infrastructure/selectors'
import {
  selectCardphotoPreview,
  selectCardphotoSessionRecord,
} from '@cardphoto/infrastructure/selectors'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import { selectMergedDispatchDates } from '@date/infrastructure/selectors'
import { selectEnvelopeSessionRecord } from '@features/envelope/infrastructure/selectors'
import { selectAppliedRecipientDisplayAddress } from '@envelope/recipient/infrastructure/selectors'

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
      // if (status === 'cart') cardBase = selectPostcardById(state, id)
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
    selectCardtextAppliedSessionData,
    selectCardphotoPreview,
    selectSelectedAroma,
    selectMergedDispatchDates,
    selectEnvelopeSessionRecord,
    selectAppliedRecipientDisplayAddress,
  ],
  (editor, cardtext, cardphoto, aroma, dates, envelope, appliedRecipient) => {
    const recipientCount = envelope.recipient?.applied?.length ?? 0
    const date = dates[0] ?? null

    return {
      ...editor,
      data: {
        cardphoto,
        cardtext,
        // Для пирога: если один получатель — рисуем применённый адрес (appliedData),
        // иначе показываем только счётчик
        recipient: recipientCount === 1 ? appliedRecipient : null,
        recipientCount,
        aroma,
        date,
        dates,
      },
    }
  },
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
