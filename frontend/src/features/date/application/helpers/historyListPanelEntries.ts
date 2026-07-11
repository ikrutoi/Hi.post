import type { RootState } from '@app/state'
import type { DispatchDate } from '@entities/date/domain/types'
import type {
  CalendarCardItem,
  CardCalendarIndex,
} from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatuses } from '@entities/postcard/domain/types'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { selectCardsByDateMap } from '@entities/card/infrastructure/selectors'
import {
  selectHistoryListSortMode,
  selectPostcardStatuses,
} from '@date/calendar/infrastructure/selectors'
import { postcardLocalIdFromCalendarCardItem } from '@date/calendar/infrastructure/postcardLocalIdFromCalendarCardItem'
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
  cardsByDateMap: Record<string, CardCalendarIndex>
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
    cardsByDateMap,
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

  const postcardItems: CalendarCardItem[] = []
  Object.values(cardsByDateMap).forEach((day) => {
    postcardItems.push(
      ...day.cart,
      ...day.ready,
      ...day.sent,
      ...day.delivered,
      ...day.error,
    )
  })

  const entries: HistoryListPanelEntry[] = []
  postcardItems.forEach((item, index) => {
    if (item.status === 'cartBlocked') return
    if (!postcardStatuses[item.status]) return
    entries.push({
      id: `history-postcard-${item.rowKey}-${index}`,
      cardId: item.cardId,
      postcardLocalId: postcardLocalIdFromCalendarCardItem(item, cartItems),
      sourceDate: item.date,
      dateLabel: formatDispatchDateLabel(item.date),
      previewUrl: item.previewUrl,
      detailLine: resolveRecipientDetailLine(item.cardId),
      previewStatus: item.status,
      previewIsProcessed: item.isProcessed,
      previewAllowBlob: item.previewAllowBlob,
    })
  })

  return entries
}

export function buildHistoryListPanelEntriesFromState(
  state: RootState,
): HistoryListPanelEntry[] {
  return buildHistoryListPanelEntries({
    cardsByDateMap: selectCardsByDateMap(state),
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
