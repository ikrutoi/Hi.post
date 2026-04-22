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
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import {
  selectRecipientsDisplayList,
  selectRecipientsPendingResolvedEntries,
} from '@envelope/recipient/infrastructure/selectors'
import type { DateListPanelItem } from '@date/presentation/DateListPanel'
import {
  formatDetailLineFromAddressBookEntry,
  formatDetailLineFromAddressFields,
  formatPostcardRecipientDetail,
  formatRecipientDetailFromLayers,
  formatRecipientLine,
  hasCommittedSessionRecipient,
} from '../helpers/formatRecipientPlanDetailLine'

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
    if (!hasCommittedSessionRecipient(recipientState)) return undefined
    const cartDraft = cartItems.find((p) => p.status === 'cart')
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
  }, [cartItems, recipientState, recipientEntries, envelopeRecipients])

  const resolveRecipientDetailLine = useCallback(
    (cardId: string): string | undefined => {
      if (cardId === 'current_session') {
        return hasCommittedSessionRecipient(recipientState)
          ? sessionRecipientDetail
          : undefined
      }
      return formatRecipientLine(
        postcardByCardId.get(cardId),
        recipientEntries,
        envelopeRecipients,
      )
    },
    [
      sessionRecipientDetail,
      postcardByCardId,
      recipientEntries,
      envelopeRecipients,
      recipientState,
    ],
  )

  /**
   * Ветки списка дат / плана: только закреплённый выбор в `recipient.applied` / `appliedData`.
   * Не опираться на `recipientsPendingIds` / выбранные строки книги без apply — иначе после
   * сброса получателя в конверте остаётся «чужая» подпись из pending.
   */
  const recipientSlots = useMemo(() => {
    const resolveBranchDetailLine = (id: string): string | undefined => {
      const fromBook = recipientEntries.find((e) => e.id === id)
      if (fromBook) return formatDetailLineFromAddressBookEntry(fromBook)
      const fromEnv = envelopeRecipients.find((r) => r.recipientViewId === id)
      if (fromEnv) {
        return formatRecipientDetailFromLayers(
          fromEnv,
          recipientEntries,
          envelopeRecipients,
          { useDraftWhenNoApplied: true },
        )
      }
      const fromDisplay = recipientsDisplayList.find((e) => e.id === id)
      if (fromDisplay) return formatDetailLineFromAddressBookEntry(fromDisplay)
      const fromResolved = recipientsPendingResolvedEntries.find(
        (e) => e.id === id,
      )
      if (fromResolved) return formatDetailLineFromAddressBookEntry(fromResolved)
      const cartForRecipient = cartPostcardByRecipientId.get(id)
      if (cartForRecipient) {
        return formatPostcardRecipientDetail(
          cartForRecipient,
          recipientEntries,
          envelopeRecipients,
        )
      }
      return undefined
    }

    const applied = recipientState.applied ?? []
    if (applied.length > 0) {
      return applied.map((id) => ({
        key: id,
        detailLine: resolveBranchDetailLine(id),
      }))
    }
    if (recipientState.appliedData != null) {
      return [
        {
          key: 'session',
          detailLine: formatDetailLineFromAddressFields(
            recipientState.appliedData,
          ),
        },
      ]
    }
    return [{ key: 'session', detailLine: sessionRecipientDetail }]
  }, [
    recipientState.applied,
    recipientState.appliedData,
    recipientsPendingResolvedEntries,
    recipientsDisplayList,
    envelopeRecipients,
    recipientEntries,
    cartPostcardByRecipientId,
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
      const fromCartDetailLine =
        fromCart && hasCommittedSessionRecipient(recipientState)
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
    recipientState,
  ])
}
