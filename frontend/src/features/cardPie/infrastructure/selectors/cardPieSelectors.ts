import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import type { PostcardStatus } from '@entities/postcard'
import { selectCardEditorState } from '@entities/cardEditor/infrastructure/selectors'
import { selectCardtextDisplayForMiniStrip } from '@cardtext/infrastructure/selectors'
import { selectCardphotoPreview } from '@cardphoto/infrastructure/selectors'
import {
  buildCardPieInnerDataFromPostcard,
  buildDatePreviewLines,
  buildPieSectionFlagsFromInner,
  buildRecipientPreviewLines,
  isPostcardPieAllComplete,
  recipientAppliedCount,
} from '../postcardCardPieViewModel'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import { selectMergedDispatchDates } from '@date/infrastructure/selectors'
import { selectEnvelopeSessionRecord } from '@features/envelope/infrastructure/selectors'
import {
  selectAppliedRecipientDisplayAddress,
  selectRecipientEntriesState,
} from '@envelope/recipient/infrastructure/selectors'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import type { CardPieRightListSource } from '../../domain/types'

export const selectPieDataByContext = createSelector(
  [
    (state: RootState) => state,
    (_state, isProcessed: boolean) => isProcessed,
    (_state, _isProcessed, status?: PostcardStatus) => status,
    (_state, _isProcessed, _status, id?: string) => id,
  ],
  (state, isProcessed, status, id) => {
    if (isProcessed) {
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
    selectCardtextDisplayForMiniStrip,
    selectCardphotoPreview,
    selectSelectedAroma,
    selectMergedDispatchDates,
    selectEnvelopeSessionRecord,
    selectAppliedRecipientDisplayAddress,
    selectRecipientsList,
    selectRecipientEntriesState,
  ],
  (
    editor,
    cardtext,
    cardphoto,
    aroma,
    dates,
    envelope,
    appliedRecipient,
    envelopeRecipients,
    recipientEntries,
  ) => {
    const recipientCount = recipientAppliedCount(envelope.recipient)
    const date = dates[0] ?? null
    const recipientPreviewLines = buildRecipientPreviewLines(envelope.recipient, {
      envelopeRecipients,
      recipientEntries,
    })
    const datePreviewLines = buildDatePreviewLines(dates)

    return {
      ...editor,
      data: {
        cardphoto,
        cardtext,
        recipient: recipientCount === 1 ? appliedRecipient : null,
        recipientCount,
        recipientPreviewLines,
        datePreviewLines,
        aroma,
        date,
        dates,
      },
    }
  },
)

export const selectListArchiveCardPieBundle = createSelector(
  [
    (state: RootState) => state.cart.items,
    (_state: RootState, id?: string) => id,
    (
      _state: RootState,
      _id?: string,
      _listSource?: CardPieRightListSource | null,
    ) => _listSource ?? null,
    selectRecipientsList,
    selectRecipientEntriesState,
  ],
  (items, id, _listSource, envelopeRecipients, recipientEntries) => {
    if (id == null || id === '') return null
    const postcardNumericId = Number(id)
    if (Number.isNaN(postcardNumericId)) return null
    const postcard = items.find((p) => p.localId === postcardNumericId)
    if (!postcard) return null
    const inner = buildCardPieInnerDataFromPostcard(postcard, {
      envelopeRecipients,
      recipientEntries,
    })
    const sections = buildPieSectionFlagsFromInner(
      inner,
      Boolean(postcard.card.envelope?.isComplete),
    )
    return {
      currentData: { data: inner },
      sections,
      isAllComplete: isPostcardPieAllComplete(sections),
    }
  },
)

/** @deprecated Prefer `selectListArchiveCardPieBundle(state, id, source)`. */
export const selectCartArchiveCardPieBundle = (state: RootState, id?: string) =>
  selectListArchiveCardPieBundle(state, id, 'cart')
