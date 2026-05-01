import { useMemo } from 'react'
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
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import { selectCardtextState } from '@cardtext/infrastructure/selectors'
import { selectFirstProcessedCardThumbnailUrl } from '@entities/card/infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import {
  selectEnvelopeSessionRecord,
  selectRecipientsList,
} from '@envelope/infrastructure/selectors'
import {
  selectRecipientsDisplayList,
  selectRecipientsPendingResolvedEntries,
} from '@envelope/recipient/infrastructure/selectors'
import type { DateListPanelItem } from '@date/presentation/DateListPanel'
import { listEntryPriceLine } from '@shared/utils/listEntryPriceLine'
import {
  dispatchBranchKeyFromPostcard,
  dispatchDateKeyFromDispatchDate,
  recipientBranchKeyFromEnvelope,
} from '@date/domain/dispatchBranchKey'
import {
  formatDetailLineFromAddressBookEntry,
  formatDetailLineFromAddressFields,
  formatPostcardRecipientDetail,
  formatRecipientDetailFromLayers,
  formatRecipientLine,
  hasCommittedSessionRecipient,
} from '../helpers/formatRecipientPlanDetailLine'
import type { CardPieRefs } from '@features/cardPie/domain/types'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import { selectPieProgress } from '@entities/cardEditor/infrastructure/selectors'

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

/** Отрицательное — a раньше b; положительное — a позже b. */
function compareDispatchDateChronological(
  a: DispatchDate,
  b: DispatchDate,
): number {
  if (a.year !== b.year) return a.year - b.year
  if (a.month !== b.month) return a.month - b.month
  return a.day - b.day
}

function postcardRecipientTemplateId(p: PostcardHydrated): string | null {
  const r = p.card?.envelope?.recipient
  if (!r) return null
  const applied = r.applied ?? []
  if (applied.length > 0) return applied[0] ?? null
  if (r.recipientViewId) return r.recipientViewId
  return null
}

function thumbnailUrlFromCartPostcard(p: PostcardHydrated): string | undefined {
  const c = p.card
  const thumb = typeof c.thumbnailUrl === 'string' ? c.thumbnailUrl.trim() : ''
  if (thumb !== '') return thumb
  const meta = c.cardphoto?.appliedData ?? c.cardphoto?.assetData
  const url = (meta?.thumbnail?.url || meta?.full?.url || meta?.url || '').trim()
  return url !== '' ? url : undefined
}

export type UseDispatchPlanListEntriesOptions = {
  /**
   * `false`: same rows as Date list (multi + inactive cached single; single + inactive cached multi).
   * `true`: only the active date UI mode — multi (`selectedDates` only) or single (`selectedDate` only);
   * no inactive cached rows from the other mode.
   */
  activeModeOnly: boolean
  /**
   * Сортировка по дате: `asc` — более ранняя дата выше; `desc` — наоборот.
   * Стабильная сортировка: при равной дате сохраняется порядок веток получателя.
   */
  listSortDirection?: 'asc' | 'desc'
  /**
   * Не показывать строки, для которых уже есть открытка в корзине (ветка `dispatchBranchKey`).
   * По умолчанию `false`: строка остаётся, с превью из корзины, если нет сессионного cardphoto.
   */
  hideBranchesInCart?: boolean
  /**
   * Для CardPie: если дата не выбрана, но заполнена хотя бы одна секция,
   * показывать строку без даты и без цены.
   */
  showUndatedWhenAnySectionSelected?: boolean
}

/**
 * Plan rows for Date list / Card pie list: dispatch date × recipient branch, preview, cart tie-in.
 */
export function useDispatchPlanListEntries(
  options: UseDispatchPlanListEntriesOptions,
): DateListPanelItem[] {
  const {
    activeModeOnly,
    listSortDirection = 'asc',
    hideBranchesInCart = false,
    showUndatedWhenAnySectionSelected = false,
  } = options
  const dispatch = useAppDispatch()
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
  const envelopeRecord = useAppSelector(selectEnvelopeSessionRecord)
  const cardphotoState = useAppSelector(selectCardphotoState)
  const cardtextState = useAppSelector(selectCardtextState)
  const selectedAroma = useAppSelector(selectSelectedAroma)
  const pieProgress = useAppSelector(selectPieProgress)
  const { previewUrl: cardphotoPreviewUrl } = useAppSelector(
    selectCardphotoPreview,
  )
  const processedThumbFallback = useAppSelector(
    selectFirstProcessedCardThumbnailUrl,
  )
  const listPreviewUrl = cardphotoPreviewUrl ?? processedThumbFallback ?? null

  const cartPostcardByDispatchBranchKey = useMemo(() => {
    const m = new Map<string, PostcardHydrated>()
    for (const p of cartItems) {
      if (p.status !== 'cart') continue
      const key = dispatchBranchKeyFromPostcard(p)
      if (key && !m.has(key)) m.set(key, p)
    }
    return m
  }, [cartItems])

  const cartPostcardByRecipientId = useMemo(() => {
    const m = new Map<string, PostcardHydrated>()
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
    const sessionBranchKey = recipientBranchKeyFromEnvelope(envelopeRecord)
    if (applied.length > 0) {
      return applied.map((id) => ({
        branchKey: id,
        detailLine: resolveBranchDetailLine(id),
        isSessionSlot: false,
      }))
    }
    if (recipientState.appliedData != null) {
      return [
        {
          branchKey: sessionBranchKey,
          detailLine: formatDetailLineFromAddressFields(
            recipientState.appliedData,
          ),
          isSessionSlot: true,
        },
      ]
    }
    return [
      {
        branchKey: sessionBranchKey,
        detailLine: sessionRecipientDetail,
        isSessionSlot: true,
      },
    ]
  }, [
    recipientState.applied,
    recipientState.appliedData,
    recipientsPendingResolvedEntries,
    recipientsDisplayList,
    envelopeRecipients,
    recipientEntries,
    cartPostcardByRecipientId,
    sessionRecipientDetail,
    envelopeRecord,
  ])

  return useMemo(() => {
    const appliedRecipientCount = recipientState.applied?.length ?? 0

    const row = (
      d: DispatchDate,
      idSuffix: string,
      branchKey: string,
      variant?: 'inactive',
      onDelete?: () => void,
      recipientDetailLine?: string | null,
      cartPostcard?: PostcardHydrated,
      isSessionSlot?: boolean,
    ): DateListPanelItem => {
      const fromCart = cartPostcard
      const cartListPreviewUrl = fromCart
        ? thumbnailUrlFromCartPostcard(fromCart)
        : undefined
      /** Сессия (cardphoto / processed); иначе превью открытки из корзины по этой ветке. */
      const hasSessionListPreview =
        listPreviewUrl != null && listPreviewUrl !== ''
      const previewUrl = hasSessionListPreview
        ? listPreviewUrl
        : cartListPreviewUrl
      const cardId = hasSessionListPreview
        ? 'current_session'
        : cartListPreviewUrl && fromCart
          ? fromCart.id
          : undefined
      const fromCartDetailLine =
        fromCart && hasCommittedSessionRecipient(recipientState)
          ? formatPostcardRecipientDetail(
              fromCart,
              recipientEntries,
              envelopeRecipients,
            )
          : undefined
      const sessionLineFallback =
        appliedRecipientCount > 1 &&
        !isSessionSlot &&
        !fromCartDetailLine &&
        (recipientDetailLine == null || recipientDetailLine === '')
          ? undefined
          : sessionRecipientDetail
      const trimmedRecipientDetail =
        recipientDetailLine != null && recipientDetailLine.trim() !== ''
          ? recipientDetailLine
          : undefined
      const recipientRef = branchKey.includes('|')
        ? branchKey.split('|')[1] ?? 'session'
        : 'session'
      const cardPieRefs: CardPieRefs = {
        cardphoto: String(cardphotoState?.appliedData?.id ?? ''),
        cardtext: String(cardtextState?.appliedData?.id ?? ''),
        sender: String(envelopeRecord?.sender?.senderViewId ?? 'session'),
        recipient: String(recipientRef),
        aroma: String(selectedAroma?.index ?? ''),
      }

      return {
        id: `${d.year}-${d.month}-${d.day}-${idSuffix}`,
        sourceDate: d,
        dateLabel: formatDispatchDateLabel(d),
        detailLine:
          fromCartDetailLine ??
          trimmedRecipientDetail ??
          sessionLineFallback ??
          undefined,
        priceLine: listEntryPriceLine(fromCart),
        previewUrl,
        cardId,
        previewIsProcessed: true,
        variant,
        onDelete,
        dispatchBranchKey: branchKey,
        cardPieRefs,
      }
    }

    const entries: DateListPanelItem[] = []
    /** Как у CardPie / бэджа: хотя бы одна секция считается заполненной по тем же правилам, что `selectPieProgress`. */
    const hasAnySectionFilled = pieProgress.progress > 0

    const appendMultiBlock = (includeInactiveCachedSingle: boolean) => {
      if (includeInactiveCachedSingle && cachedSingleDate) {
        recipientSlots.forEach((slot, ri) => {
          const branchKey = `${dispatchDateKeyFromDispatchDate(cachedSingleDate)}|${slot.branchKey}`
          if (excludedDispatchBranchSet.has(branchKey)) return
          const cartP = cartPostcardByDispatchBranchKey.get(branchKey)
          if (hideBranchesInCart && cartP) return
          entries.push(
            row(
              cachedSingleDate,
              `cached-single-rcpt-${slot.branchKey}-${ri}`,
              branchKey,
              'inactive',
              undefined,
              slot.detailLine,
              cartP,
              slot.isSessionSlot,
            ),
          )
        })
      }
      selectedDates.forEach((d, i) => {
        recipientSlots.forEach((slot, ri) => {
          const branchKey = `${dispatchDateKeyFromDispatchDate(d)}|${slot.branchKey}`
          if (excludedDispatchBranchSet.has(branchKey)) return
          const cartP = cartPostcardByDispatchBranchKey.get(branchKey)
          if (hideBranchesInCart && cartP) return
          entries.push(
            row(
              d,
              `m-${i}-rcpt-${slot.branchKey}-${ri}`,
              branchKey,
              undefined,
              () => {
                dispatch(excludeDispatchBranch({ branchKey }))
                const nextExcluded = new Set(excludedDispatchBranchSet)
                nextExcluded.add(branchKey)
                const anyLeftThisDate = recipientSlots.some(
                  (s) =>
                    !nextExcluded.has(
                      `${dispatchDateKeyFromDispatchDate(d)}|${s.branchKey}`,
                    ),
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
              slot.isSessionSlot,
            ),
          )
        })
      })
    }

    const appendSingleBlock = (includeInactiveCachedMulti: boolean) => {
      if (selectedDate) {
        recipientSlots.forEach((slot, ri) => {
          const branchKey = `${dispatchDateKeyFromDispatchDate(selectedDate)}|${slot.branchKey}`
          if (excludedDispatchBranchSet.has(branchKey)) return
          const cartP = cartPostcardByDispatchBranchKey.get(branchKey)
          if (hideBranchesInCart && cartP) return
          entries.push(
            row(
              selectedDate,
              `single-rcpt-${slot.branchKey}-${ri}`,
              branchKey,
              undefined,
              () => {
                dispatch(excludeDispatchBranch({ branchKey }))
                const nextExcluded = new Set(excludedDispatchBranchSet)
                nextExcluded.add(branchKey)
                const anyLeftThisDate = recipientSlots.some(
                  (s) =>
                    !nextExcluded.has(
                      `${dispatchDateKeyFromDispatchDate(selectedDate)}|${s.branchKey}`,
                    ),
                )
                if (!anyLeftThisDate) {
                  dispatch(pickDispatchDate(selectedDate))
                }
              },
              slot.detailLine,
              cartP,
              slot.isSessionSlot,
            ),
          )
        })
      }
      if (includeInactiveCachedMulti) {
        cachedMultiDates.forEach((d, i) => {
          recipientSlots.forEach((slot, ri) => {
            const branchKey = `${dispatchDateKeyFromDispatchDate(d)}|${slot.branchKey}`
            if (excludedDispatchBranchSet.has(branchKey)) return
            const cartP = cartPostcardByDispatchBranchKey.get(branchKey)
            if (hideBranchesInCart && cartP) return
            entries.push(
              row(
                d,
                `cached-m-${i}-rcpt-${slot.branchKey}-${ri}`,
                branchKey,
                'inactive',
                undefined,
                slot.detailLine,
                cartP,
                slot.isSessionSlot,
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
    } else if (isMultiDateMode) {
      appendMultiBlock(true)
    } else {
      appendSingleBlock(true)
    }

    if (
      showUndatedWhenAnySectionSelected &&
      entries.length === 0 &&
      hasAnySectionFilled
    ) {
      /** План пустой (например все ветки скрыты) — показываем выбранную дату без ветки корзины. */
      const fallbackDispatchDate: DispatchDate | null = !isMultiDateMode
        ? selectedDate
        : selectedDates.length === 1
          ? (selectedDates[0] ?? null)
          : selectedDates.length > 1
            ? [...selectedDates].sort(compareDispatchDateChronological)[0] ??
              null
            : null
      const fallbackDateLabel =
        fallbackDispatchDate != null
          ? formatDispatchDateLabel(fallbackDispatchDate)
          : ''

      recipientSlots.forEach((slot, ri) => {
        const recipientRef = slot.branchKey.includes('|')
          ? (slot.branchKey.split('|')[1] ?? 'session')
          : 'session'
        const cardPieRefs: CardPieRefs = {
          cardphoto: String(cardphotoState?.appliedData?.id ?? ''),
          cardtext: String(cardtextState?.appliedData?.id ?? ''),
          sender: String(envelopeRecord?.sender?.senderViewId ?? 'session'),
          recipient: String(recipientRef),
          aroma: String(selectedAroma?.index ?? ''),
        }
        const undatedDetailLine =
          slot.detailLine != null && slot.detailLine.trim() !== ''
            ? slot.detailLine
            : sessionRecipientDetail
        entries.push({
          id: `undated-rcpt-${slot.branchKey}-${ri}`,
          ...(fallbackDispatchDate != null
            ? { sourceDate: fallbackDispatchDate }
            : {}),
          dateLabel: fallbackDateLabel,
          detailLine: undatedDetailLine,
          priceLine: undefined,
          previewUrl: listPreviewUrl ?? undefined,
          cardId: listPreviewUrl ? 'current_session' : undefined,
          previewIsProcessed: true,
          dispatchBranchKey: undefined,
          cardPieRefs,
        })
      })
    }

    const dir = listSortDirection === 'asc' ? 1 : -1
    entries.sort((x, y) => {
      const a = x.sourceDate
      const b = y.sourceDate
      if (!a || !b) return 0
      return dir * compareDispatchDateChronological(a, b)
    })

    return entries
  }, [
    activeModeOnly,
    listSortDirection,
    hideBranchesInCart,
    dispatch,
    isMultiDateMode,
    selectedDate,
    selectedDates,
    cachedSingleDate,
    cachedMultiDates,
    sessionRecipientDetail,
    recipientSlots,
    listPreviewUrl,
    cardphotoState?.appliedData?.id,
    cardtextState?.appliedData?.id,
    envelopeRecord?.sender?.senderViewId,
    selectedAroma?.index,
    pieProgress.progress,
    showUndatedWhenAnySectionSelected,
    cartPostcardByDispatchBranchKey,
    recipientEntries,
    envelopeRecipients,
    excludedDispatchBranchSet,
    recipientState,
  ])
}
