import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  pickDispatchDate,
  setSelectedDates,
  excludeDispatchBranch,
} from '@date/infrastructure/state'
import { selectCartItems } from '@cart/infrastructure/selectors'
import {
  selectCachedMultiDates,
  selectCachedSingleDate,
  selectIsMultiDateMode,
  selectSelectedDate,
  selectSelectedDates,
  selectExcludedDispatchBranchSet,
} from '@date/infrastructure/selectors'
import { selectCardphotoPreview } from '@cardphoto/infrastructure/selectors'
import { selectFirstProcessedCardThumbnailUrl } from '@entities/card/infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'
import type {
  CalendarCardItem,
  CardCalendarIndex,
} from '@entities/card/domain/types'
import type { Postcard } from '@entities/postcard'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import type { RecipientState } from '@envelope/recipient/domain/types'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import {
  selectRecipientsList,
  selectRecipientsPendingIds,
  selectSelectedRecipientEntriesInOrder,
} from '@envelope/infrastructure/selectors'
import {
  selectRecipientEnabled,
  selectRecipientsDisplayList,
  selectRecipientsPendingResolvedEntries,
} from '@envelope/recipient/infrastructure/selectors'
import type { DateListPanelItem } from '@date/presentation/DateListPanel'

function formatDispatchDateLabel(d: DispatchDate): string {
  const date = new Date(d.year, d.month, d.day)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const sameDispatchDate = (a: DispatchDate, b: DispatchDate) =>
  a.year === b.year && a.month === b.month && a.day === b.day

const dispatchDateKey = (d: DispatchDate) =>
  `${d.year}-${d.month}-${d.day}`

function postcardRecipientTemplateId(p: Postcard): string | null {
  const r = p.card?.envelope?.recipient
  if (!r) return null
  const applied = r.applied ?? []
  if (applied.length > 0) return applied[0] ?? null
  if (r.recipientViewId) return r.recipientViewId
  return null
}

function flattenDayData(dayData: CardCalendarIndex): CalendarCardItem[] {
  const list: CalendarCardItem[] = []
  if (dayData.processed) list.push(dayData.processed)
  list.push(...dayData.cart)
  list.push(...dayData.ready)
  list.push(...dayData.sent)
  list.push(...dayData.delivered)
  list.push(...dayData.error)
  return list
}

function formatRecipientDetailFromLayers(
  recipient: RecipientState | undefined,
): string | undefined {
  if (!recipient) return undefined
  const source =
    recipient.appliedData ??
    recipient.viewDraft ??
    recipient.formDraft ??
    null
  const name = String(source?.name ?? '').trim()
  const country = String(source?.country ?? '').trim()
  const city = String(source?.city ?? '').trim()
  const region = country || city
  if (name && region) return `${name}, ${region}`
  return name || region || undefined
}

function formatRecipientLine(postcard: Postcard | undefined): string | undefined {
  return formatRecipientDetailFromLayers(postcard?.card?.envelope?.recipient)
}

function formatPostcardRecipientDetail(
  postcard: Postcard | undefined,
  recipientEntries: AddressBookEntry[],
  envelopeRecipients: RecipientState[],
): string | undefined {
  if (!postcard) return undefined
  const r = postcard.card?.envelope?.recipient
  if (!r) return undefined
  const appliedId = r.applied?.[0]
  if (appliedId) {
    const bookEntry = recipientEntries.find((e) => e.id === appliedId)
    if (bookEntry) {
      const line = formatDetailLineFromAddressBookEntry(bookEntry)
      if (line) return line
    }
    const envRow = envelopeRecipients.find(
      (row) => row.recipientViewId === appliedId,
    )
    if (envRow) {
      const line = formatRecipientDetailFromLayers(envRow)
      if (line) return line
    }
  }
  return formatRecipientLine(postcard)
}

function formatDetailLineFromAddressBookEntry(
  entry: AddressBookEntry,
): string | undefined {
  const addr = entry.address
  if (!addr) return undefined
  const name = String(addr.name ?? '').trim()
  const country = String(addr.country ?? '').trim()
  const city = String(addr.city ?? '').trim()
  const region = country || city
  if (name && region) return `${name}, ${region}`
  return name || region || undefined
}

export type UseDispatchPlanListEntriesOptions = {
  /**
   * `false`: same rows as Date list (multi + inactive cached single; single + inactive cached multi).
   * `true`: only the active date UI mode — multi (`selectedDates` only) or single (`selectedDate` only);
   * no inactive cached rows from the other mode.
   */
  activeModeOnly: boolean
}

/**
 * Plan rows for Date list / Card pie list: dispatch date × recipient branch, preview, cart tie-in.
 */
export function useDispatchPlanListEntries(
  options: UseDispatchPlanListEntriesOptions,
): DateListPanelItem[] {
  const { activeModeOnly } = options
  const dispatch = useAppDispatch()
  const openDayPanel = useAppSelector((state) => state.calendar.openDayPanel)
  const selectedDate = useAppSelector(selectSelectedDate)
  const selectedDates = useAppSelector(selectSelectedDates)
  const cachedMultiDates = useAppSelector(selectCachedMultiDates)
  const isMultiDateMode = useAppSelector(selectIsMultiDateMode)
  const cachedSingleDate = useAppSelector(selectCachedSingleDate)
  const cartItems = useAppSelector(selectCartItems)
  const recipientState = useAppSelector(selectRecipientState)
  const selectedRecipientEntriesInOrder = useAppSelector(
    selectSelectedRecipientEntriesInOrder,
  )
  const recipientEnabled = useAppSelector(selectRecipientEnabled)
  const recipientsPendingIds = useAppSelector(selectRecipientsPendingIds)
  const recipientsDisplayList = useAppSelector(selectRecipientsDisplayList)
  const recipientsPendingResolvedEntries = useAppSelector(
    selectRecipientsPendingResolvedEntries,
  )
  const envelopeRecipients = useAppSelector(selectRecipientsList)
  const recipientEntries = useAppSelector(
    (s) => s.addressBook?.recipientEntries ?? [],
  )
  const excludedDispatchBranchSet = useAppSelector(selectExcludedDispatchBranchSet)
  const { previewUrl: cardphotoPreviewUrl } = useAppSelector(
    selectCardphotoPreview,
  )
  const processedThumbFallback = useAppSelector(
    selectFirstProcessedCardThumbnailUrl,
  )
  const listPreviewUrl = cardphotoPreviewUrl ?? processedThumbFallback ?? null
  const postcardByCardId = useMemo(
    () => new Map(cartItems.map((p) => [p.card.id, p] as const)),
    [cartItems],
  )

  const cartPostcardByDateKeyAndRecipient = useMemo(() => {
    const m = new Map<string, Postcard>()
    for (const p of cartItems) {
      if (p.status !== 'cart') continue
      const rk = postcardRecipientTemplateId(p)
      if (!rk) continue
      const key = `${dispatchDateKey(p.card.date)}|${rk}`
      if (!m.has(key)) m.set(key, p)
    }
    return m
  }, [cartItems])

  const cartPostcardByRecipientId = useMemo(() => {
    const m = new Map<string, Postcard>()
    for (const p of cartItems) {
      if (p.status !== 'cart') continue
      const rk = postcardRecipientTemplateId(p)
      if (!rk || m.has(rk)) continue
      m.set(rk, p)
    }
    return m
  }, [cartItems])

  const sessionRecipientDetail = useMemo(() => {
    const cartDraft = cartItems.find((p) => p.status === 'cart')
    const fromPostcard = formatRecipientLine(cartDraft)
    if (fromPostcard) return fromPostcard
    return formatRecipientDetailFromLayers(recipientState)
  }, [cartItems, recipientState])

  const resolveRecipientDetailLine = useCallback(
    (cardId: string): string | undefined => {
      if (cardId === 'current_session') return sessionRecipientDetail
      return formatRecipientLine(postcardByCardId.get(cardId))
    },
    [sessionRecipientDetail, postcardByCardId],
  )

  const recipientSlots = useMemo(() => {
    if (recipientEnabled && recipientsPendingIds.length > 0) {
      return recipientsPendingIds.map((id) => {
        const fromBook = recipientEntries.find((e) => e.id === id)
        if (fromBook) {
          return {
            key: id,
            detailLine: formatDetailLineFromAddressBookEntry(fromBook),
          }
        }
        const fromEnv = envelopeRecipients.find((r) => r.recipientViewId === id)
        if (fromEnv) {
          return {
            key: id,
            detailLine: formatRecipientDetailFromLayers(fromEnv),
          }
        }
        const fromDisplay = recipientsDisplayList.find((e) => e.id === id)
        if (fromDisplay) {
          return {
            key: id,
            detailLine: formatDetailLineFromAddressBookEntry(fromDisplay),
          }
        }
        const fromResolved = recipientsPendingResolvedEntries.find(
          (e) => e.id === id,
        )
        if (fromResolved) {
          return {
            key: id,
            detailLine: formatDetailLineFromAddressBookEntry(fromResolved),
          }
        }
        const cartForRecipient = cartPostcardByRecipientId.get(id)
        const lineFromCart = cartForRecipient
          ? formatPostcardRecipientDetail(
              cartForRecipient,
              recipientEntries,
              envelopeRecipients,
            )
          : undefined
        if (lineFromCart) {
          return { key: id, detailLine: lineFromCart }
        }
        return { key: id, detailLine: undefined }
      })
    }
    if (selectedRecipientEntriesInOrder.length > 0) {
      return selectedRecipientEntriesInOrder.map((e) => ({
        key: e.id,
        detailLine: formatDetailLineFromAddressBookEntry(e),
      }))
    }
    return [{ key: 'session', detailLine: sessionRecipientDetail }]
  }, [
    recipientEnabled,
    recipientsPendingIds,
    recipientsPendingResolvedEntries,
    recipientsDisplayList,
    envelopeRecipients,
    recipientEntries,
    cartPostcardByRecipientId,
    selectedRecipientEntriesInOrder,
    sessionRecipientDetail,
  ])

  return useMemo(() => {
    if (openDayPanel) {
      return flattenDayData(openDayPanel.dayData).map((item, i) => ({
        detailLine: resolveRecipientDetailLine(item.cardId),
        id: `day-panel-${openDayPanel.dateKey}-${item.rowKey}-${i}`,
        cardId: item.cardId,
        sourceDate: item.date,
        dateLabel: formatDispatchDateLabel(item.date),
        previewUrl: item.previewUrl,
        previewIsProcessed: true,
      }))
    }

    const row = (
      d: DispatchDate,
      idSuffix: string,
      variant?: 'inactive',
      onDelete?: () => void,
      recipientDetailLine?: string | null,
      cartPostcard?: Postcard,
    ): DateListPanelItem => {
      const fromCart = cartPostcard
      const previewUrl =
        listPreviewUrl ?? fromCart?.card.thumbnailUrl ?? undefined
      const cardId =
        listPreviewUrl != null && listPreviewUrl !== ''
          ? 'current_session'
          : fromCart?.card.id ??
            (previewUrl ? 'current_session' : undefined)
      const fromCartDetailLine = fromCart
        ? formatPostcardRecipientDetail(
            fromCart,
            recipientEntries,
            envelopeRecipients,
          )
        : undefined
      return {
        id: `${d.year}-${d.month}-${d.day}-${idSuffix}`,
        sourceDate: d,
        dateLabel: formatDispatchDateLabel(d),
        detailLine:
          fromCartDetailLine ??
          recipientDetailLine ??
          sessionRecipientDetail ??
          undefined,
        previewUrl,
        cardId,
        previewIsProcessed: true,
        variant,
        onDelete,
      }
    }

    const entries: DateListPanelItem[] = []

    const appendMultiBlock = (includeInactiveCachedSingle: boolean) => {
      if (includeInactiveCachedSingle && cachedSingleDate) {
        recipientSlots.forEach((slot, ri) => {
          const branchKey = `${dispatchDateKey(cachedSingleDate)}|${slot.key}`
          if (excludedDispatchBranchSet.has(branchKey)) return
          const cartP =
            slot.key !== 'session'
              ? cartPostcardByDateKeyAndRecipient.get(
                  `${dispatchDateKey(cachedSingleDate)}|${slot.key}`,
                )
              : undefined
          entries.push(
            row(
              cachedSingleDate,
              `cached-single-rcpt-${slot.key}-${ri}`,
              'inactive',
              undefined,
              slot.detailLine,
              cartP,
            ),
          )
        })
      }
      selectedDates.forEach((d, i) => {
        recipientSlots.forEach((slot, ri) => {
          const branchKey = `${dispatchDateKey(d)}|${slot.key}`
          if (excludedDispatchBranchSet.has(branchKey)) return
          const cartP =
            slot.key !== 'session'
              ? cartPostcardByDateKeyAndRecipient.get(
                  `${dispatchDateKey(d)}|${slot.key}`,
                )
              : undefined
          entries.push(
            row(
              d,
              `m-${i}-rcpt-${slot.key}-${ri}`,
              undefined,
              () => {
                dispatch(excludeDispatchBranch({ branchKey }))
                const nextExcluded = new Set(excludedDispatchBranchSet)
                nextExcluded.add(branchKey)
                const anyLeftThisDate = recipientSlots.some(
                  (s) =>
                    !nextExcluded.has(`${dispatchDateKey(d)}|${s.key}`),
                )
                if (!anyLeftThisDate) {
                  dispatch(
                    setSelectedDates(
                      selectedDates.filter((x) => !sameDispatchDate(x, d)),
                    ),
                  )
                }
              },
              slot.detailLine,
              cartP,
            ),
          )
        })
      })
    }

    const appendSingleBlock = (includeInactiveCachedMulti: boolean) => {
      if (selectedDate) {
        recipientSlots.forEach((slot, ri) => {
          const branchKey = `${dispatchDateKey(selectedDate)}|${slot.key}`
          if (excludedDispatchBranchSet.has(branchKey)) return
          const cartP =
            slot.key !== 'session'
              ? cartPostcardByDateKeyAndRecipient.get(
                  `${dispatchDateKey(selectedDate)}|${slot.key}`,
                )
              : undefined
          entries.push(
            row(
              selectedDate,
              `single-rcpt-${slot.key}-${ri}`,
              undefined,
              () => {
                dispatch(excludeDispatchBranch({ branchKey }))
                const nextExcluded = new Set(excludedDispatchBranchSet)
                nextExcluded.add(branchKey)
                const anyLeftThisDate = recipientSlots.some(
                  (s) =>
                    !nextExcluded.has(
                      `${dispatchDateKey(selectedDate)}|${s.key}`,
                    ),
                )
                if (!anyLeftThisDate) {
                  dispatch(pickDispatchDate(selectedDate))
                }
              },
              slot.detailLine,
              cartP,
            ),
          )
        })
      }
      if (includeInactiveCachedMulti) {
        cachedMultiDates.forEach((d, i) => {
          recipientSlots.forEach((slot, ri) => {
            const branchKey = `${dispatchDateKey(d)}|${slot.key}`
            if (excludedDispatchBranchSet.has(branchKey)) return
            const cartP =
              slot.key !== 'session'
                ? cartPostcardByDateKeyAndRecipient.get(
                    `${dispatchDateKey(d)}|${slot.key}`,
                  )
                : undefined
            entries.push(
              row(
                d,
                `cached-m-${i}-rcpt-${slot.key}-${ri}`,
                'inactive',
                undefined,
                slot.detailLine,
                cartP,
              ),
            )
          })
        })
      }
    }

    if (activeModeOnly) {
      if (isMultiDateMode) {
        appendMultiBlock(false)
      } else {
        appendSingleBlock(false)
      }
      return entries
    }

    if (isMultiDateMode) {
      appendMultiBlock(true)
    } else {
      appendSingleBlock(true)
    }

    return entries
  }, [
    activeModeOnly,
    dispatch,
    openDayPanel,
    isMultiDateMode,
    selectedDate,
    selectedDates,
    cachedSingleDate,
    cachedMultiDates,
    sessionRecipientDetail,
    recipientSlots,
    resolveRecipientDetailLine,
    listPreviewUrl,
    cartPostcardByDateKeyAndRecipient,
    recipientEntries,
    envelopeRecipients,
    excludedDispatchBranchSet,
  ])
}
