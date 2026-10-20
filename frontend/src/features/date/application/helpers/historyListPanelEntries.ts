import type { RootState } from '@app/state'
import type { DispatchDate } from '@entities/date/domain/types'
import { cardListPreviewUrlFromCard } from '@entities/card/domain/helpers'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatuses } from '@entities/postcard/domain/types'
import { selectCartItems } from '@cart/infrastructure/selectors'
import {
  selectHistoryListSortMode,
  selectPostcardStatuses,
} from '@date/calendar/infrastructure/selectors'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import type { RecipientState } from '@envelope/recipient/domain/types'
import { selectRecipientEntriesState } from '@envelope/recipient/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import {
  formatPostcardListRecipientDetailLine,
  formatRecipientDetailFromLayers,
  formatRecipientLine,
  hasCommittedSessionRecipient,
} from '@date/application/helpers/formatRecipientPlanDetailLine'
import { postcardPiePrimaryDispatchDate } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import {
  sortHistoryListEntries,
  type HistoryListSortableItem,
} from '@date/application/helpers/historyListSort'

export type HistoryListPanelEntry = HistoryListSortableItem & {
  id: string
  cardId?: string
  postcardLocalId?: number
  dateLabel: string
  previewUrl?: string | null
  previewStatus?: PostcardHydrated['status']
  previewIsProcessed?: boolean
  previewAllowBlob?: boolean
}

function formatDispatchDateLabel(d: DispatchDate): string {
  const date = new Date(d.year, d.month, d.day)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export type BuildHistoryListPanelEntriesInput = {
  cartItems: readonly PostcardHydrated[]
  postcardStatuses: PostcardStatuses
  recipientEntries: readonly AddressBookEntry[]
  envelopeRecipients: readonly RecipientState[]
  recipientState: RecipientState
}

export function buildHistoryListPanelEntries(
  input: BuildHistoryListPanelEntriesInput,
): HistoryListPanelEntry[] {
  const {
    cartItems,
    postcardStatuses,
    recipientEntries,
    envelopeRecipients,
    recipientState,
  } = input

  const postcardByCardId = new Map(
    cartItems.map((postcard) => [postcard.card.id, postcard] as const),
  )

  const sessionRecipientDetail = (() => {
    if (!hasCommittedSessionRecipient(recipientState)) return undefined
    const cartDraft = cartItems.find(
      (postcard) =>
        postcard.status === 'cart' || postcard.status === 'cartBlocked',
    )
    const fromPostcard = formatRecipientLine(
      cartDraft,
      recipientEntries,
      envelopeRecipients,
    )
    if (fromPostcard) return fromPostcard
    return formatRecipientDetailFromLayers(
      recipientState,
      recipientEntries,
      envelopeRecipients,
    )
  })()

  const resolveRecipientDetailLine = (cardId: string): string | undefined => {
    if (cardId === 'current_session') {
      return hasCommittedSessionRecipient(recipientState)
        ? sessionRecipientDetail
        : undefined
    }
    return formatPostcardListRecipientDetailLine(
      postcardByCardId.get(cardId),
      recipientEntries,
      envelopeRecipients,
    )
  }

  const entries: HistoryListPanelEntry[] = []
  const seenLocalIds = new Set<number>()
  for (const postcard of cartItems) {
    if (postcard.status === 'cartBlocked' || postcard.status === 'processed') {
      continue
    }
    if (!postcardStatuses[postcard.status]) continue
    if (seenLocalIds.has(postcard.localId)) continue
    seenLocalIds.add(postcard.localId)
    const sourceDate = postcardPiePrimaryDispatchDate(postcard) ?? undefined
    entries.push({
      id: `history-postcard-${postcard.localId}`,
      cardId: postcard.card.id,
      postcardLocalId: postcard.localId,
      sourceDate,
      dateLabel: formatDispatchDateLabel(sourceDate),
      previewUrl: cardListPreviewUrlFromCard(postcard.card) ?? '',
      detailLine: resolveRecipientDetailLine(postcard.card.id),
      previewStatus: postcard.status,
      previewIsProcessed: Boolean(postcard.card.isProcessed),
      previewAllowBlob: false,
    })
  }

  return entries
}

export function buildHistoryListPanelEntriesFromState(
  state: RootState,
): HistoryListPanelEntry[] {
  return buildHistoryListPanelEntries({
    cartItems: selectCartItems(state),
    postcardStatuses: selectPostcardStatuses(state),
    recipientEntries: selectRecipientEntriesState(state),
    envelopeRecipients: selectRecipientsList(state),
    recipientState: selectRecipientState(state),
  })
}

export function sortedHistoryListPanelEntriesFromState(
  state: RootState,
): HistoryListPanelEntry[] {
  return sortHistoryListEntries(
    buildHistoryListPanelEntriesFromState(state),
    selectHistoryListSortMode(state),
  )
}

/** Порядок центральной кнопки «вперёд»: как строки списка истории, сверху вниз. */
export function historyListCycleLocalIds(state: RootState): number[] {
  const lids: number[] = []
  const seen = new Set<number>()
  for (const entry of sortedHistoryListPanelEntriesFromState(state)) {
    const localId = entry.postcardLocalId
    if (localId == null || seen.has(localId)) continue
    seen.add(localId)
    lids.push(localId)
  }
  return lids
}

export function resolveFirstHistoryListLocalIdFromState(
  state: RootState,
): number | null {
  const first = sortedHistoryListPanelEntriesFromState(state)[0]
  return first?.postcardLocalId ?? null
}

export function resolveDefaultHistoryStripPostcard(
  state: RootState,
): PostcardHydrated | null {
  const localId = resolveFirstHistoryListLocalIdFromState(state)
  if (localId == null) return null
  return (
    selectCartItems(state).find((item) => item.localId === localId) ?? null
  )
}

export function isHistoryListSelectedLocalIdInSortedList(
  localId: number | null,
  state: RootState,
): boolean {
  if (localId == null) return false
  return sortedHistoryListPanelEntriesFromState(state).some(
    (entry) => entry.postcardLocalId === localId,
  )
}
