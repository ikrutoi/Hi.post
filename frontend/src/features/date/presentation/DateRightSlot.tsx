import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  updateLastViewedCalendarDate,
  setDateListPanelOpen,
} from '@date/calendar/infrastructure/state'
import {
  pickDispatchDate,
  setSelectedDates,
  excludeDispatchBranch,
} from '@date/infrastructure/state'
import { removeItem } from '@cart/infrastructure/state'
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
import {
  selectCardsByDateMap,
  selectFirstProcessedCardThumbnailUrl,
} from '@entities/card/infrastructure/selectors'
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
import { DateListPanel } from './DateListPanel'
import { HistoryListPanel, type HistoryListPanelItem } from './HistoryListPanel'
import { useCalendarFacade } from '@date/calendar/application/facades/useCalendarFacade'
import { selectPostcardStatuses } from '@date/calendar/infrastructure/selectors'
import type { DateListPanelItem } from './DateListPanel'
import styles from './DateRightSlot.module.scss'

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

/** Id шаблона/получателя на открытке в корзине (см. createPostcardsFromEditor). */
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

/** Name + country (or city if country empty), from envelope recipient layers. */
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

/**
 * Подпись получателя для открытки в корзине: по applied[0] из адресной книги или envelopeRecipients,
 * иначе слои на карточке. Иначе при multi все варианты показывают один viewDraft редактора.
 */
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

export const DateRightSlot: React.FC<{ section: 'date' | 'history' }> = ({
  section,
}) => {
  const dispatch = useAppDispatch()
  const calendarFacade = useCalendarFacade()
  const { dateListPanelOpen, historyListPanelOpen } = calendarFacade
  const openDayPanel = useAppSelector((state) => state.calendar.openDayPanel)
  // const dateListOpen = useAppSelector(selectIsDateListPanelOpen)
  const selectedDate = useAppSelector(selectSelectedDate)
  const selectedDates = useAppSelector(selectSelectedDates)
  const cachedMultiDates = useAppSelector(selectCachedMultiDates)
  const isMultiDateMode = useAppSelector(selectIsMultiDateMode)
  const cachedSingleDate = useAppSelector(selectCachedSingleDate)
  const cardsByDateMap = useAppSelector(selectCardsByDateMap)
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
  const postcardStatuses = useAppSelector(selectPostcardStatuses)
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

  /** Одна открытка корзины на пару (дата отправки, id получателя в applied). */
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

  /** Первая открытка корзины по id получателя (любая дата) — подпись, если нет совпадения по дате. */
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

  /**
   * Один слот на каждый id в recipientsPendingIds (порядок selection).
   * Нельзя подменять весь список только `recipientsPendingResolvedEntries`: после reload
   * часть id ещё без адреса в книге — flatMap даёт меньше строк, остаётся «один получатель».
   */
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

  const dateListEntries: DateListPanelItem[] = useMemo(() => {
    if (openDayPanel) {
      return flattenDayData(openDayPanel.dayData).map((item, i) => ({
        detailLine: resolveRecipientDetailLine(item.cardId),
        id: `day-panel-${openDayPanel.dateKey}-${item.rowKey}-${i}`,
        cardId: item.cardId,
        sourceDate: item.date,
        dateLabel: formatDispatchDateLabel(item.date),
        previewUrl: item.previewUrl,
        /** Секция Дата: без индикатора статуса пайплайна (как у строк плана в `row`), не в стиле History. */
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
      /** Список дат отражает план отправки текущего редактора — превью как у рабочей открытки, не снимок из корзины. */
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

    if (isMultiDateMode) {
      if (cachedSingleDate) {
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
                if (cartP) dispatch(removeItem(cartP.localId))
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
    } else {
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
                if (cartP) dispatch(removeItem(cartP.localId))
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

    return entries
  }, [
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

  const { historyListEntries, historyUnderlyingPostcardCount } = useMemo(() => {
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
    const entries: HistoryListPanelItem[] = []
    postcardItems.forEach((item, i) => {
      if (!postcardStatuses[item.status]) return
      entries.push({
        id: `history-postcard-${item.rowKey}-${i}`,
        cardId: item.cardId,
        sourceDate: item.date,
        dateLabel: formatDispatchDateLabel(item.date),
        previewUrl: item.previewUrl,
        detailLine: resolveRecipientDetailLine(item.cardId),
        previewStatus: item.status,
        previewIsProcessed: item.isProcessed,
      })
    })
    return {
      historyListEntries: entries,
      historyUnderlyingPostcardCount: postcardItems.length,
    }
  }, [cardsByDateMap, postcardStatuses, resolveRecipientDetailLine])

  const handleCloseList = useCallback(() => {
    dispatch(setDateListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'date',
        key: 'listDate',
        value: 'enabled',
      }),
    )
  }, [dispatch])

  const handleSelectEntry = useCallback(
    (item: DateListPanelItem) => {
      if (!item.sourceDate) return
      dispatch(
        updateLastViewedCalendarDate({
          year: item.sourceDate.year,
          month: item.sourceDate.month,
        }),
      )
    },
    [dispatch],
  )

  if (dateListPanelOpen || historyListPanelOpen) {
    return (
      <div className={styles.root}>
        <div className={styles.panelWrap}>
          {section === 'date' && dateListPanelOpen && (
            <DateListPanel
              onClose={handleCloseList}
              entries={dateListEntries}
              onSelectEntry={handleSelectEntry}
            />
          )}
          {section === 'history' && historyListPanelOpen && (
            <HistoryListPanel
              onClose={handleCloseList}
              entries={historyListEntries}
              onSelectEntry={handleSelectEntry}
              hasUnderlyingHistoryEntries={historyUnderlyingPostcardCount > 0}
            />
          )}
        </div>
      </div>
    )
  }

  return null
}
