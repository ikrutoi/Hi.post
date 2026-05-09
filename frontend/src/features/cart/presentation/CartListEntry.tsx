import React, { useCallback } from 'react'
import type { PostcardStatus } from '@entities/postcard'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { isCalendarGridThirdCellFromEndDisabled } from '@date/calendar/application/logic/calendarGridThirdFromEndDisabled'
import {
  selectCartCalendarDatePickLocalId,
  selectCartCalendarDatePickMode,
  selectLastCalendarViewDate,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import {
  setCartCalendarDatePickLocalId,
  setCartCalendarDatePickMode,
  setNotebookStripDateOverCart,
  setNotebookStripTab,
  updateLastViewedCalendarDate,
} from '@date/calendar/infrastructure/state'
import { selectFirstDayOfWeek } from '@date/infrastructure/selectors'
import { getCurrentDate } from '@shared/utils/date'
import { getToolbarIcon } from '@shared/utils/icons'
import { parseListEntryRecipientDetail } from '@shared/utils/listEntryRecipientDetail'
import styles from './CartListEntry.module.scss'

export type CartListEntryVariant = 'default' | 'inactive'

export type CartListEntryProps = {
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  priceLine?: string
  variant?: CartListEntryVariant
  previewStatus?: PostcardStatus
  previewIsProcessed?: boolean
  /** `localId` открытки этой строки — нужен для адресного включения `cartCalendarDatePickMode`. */
  postcardLocalId?: number
  onSelect?: () => void
  onDelete?: () => void
  onDateEdit?: () => void
  isSelected?: boolean
  isFocused?: boolean
}

export const CartListEntry: React.FC<CartListEntryProps> = ({
  dateLabel,
  previewUrl,
  detailLine,
  priceLine,
  variant = 'default',
  previewStatus,
  previewIsProcessed,
  postcardLocalId,
  onSelect,
  onDelete,
  onDateEdit,
  isSelected = false,
  isFocused = false,
}) => {
  const interactive = Boolean(onSelect)
  const inactive = variant === 'inactive'
  const isBlockedEntry = previewStatus === 'cartBlocked'
  const labelForAria = [detailLine ? `${dateLabel}, ${detailLine}` : dateLabel, priceLine]
    .filter(Boolean)
    .join(', ')
  const recipientParts = parseListEntryRecipientDetail(detailLine)

  const dispatch = useAppDispatch()
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const cartCalendarDatePickMode = useAppSelector(selectCartCalendarDatePickMode)
  const cartCalendarDatePickLocalId = useAppSelector(
    selectCartCalendarDatePickLocalId,
  )
  const lastViewedCalendarDate = useAppSelector(selectLastCalendarViewDate)
  const firstDayOfWeek = useAppSelector(selectFirstDayOfWeek)

  /** Подсветка строки в режиме dateEdit — только если она про эту открытку. */
  const dateEditHighlight =
    cartCalendarDatePickMode &&
    postcardLocalId != null &&
    cartCalendarDatePickLocalId === postcardLocalId

  const handleDateEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!isBlockedEntry) return
      const next = !dateEditHighlight
      if (next) {
        const now = getCurrentDate()
        if (notebookStripTab !== 'cart') {
          dispatch(setNotebookStripTab('cart'))
        }
        dispatch(setNotebookStripDateOverCart(false))
        if (
          isCalendarGridThirdCellFromEndDisabled({
            calendarViewDate: lastViewedCalendarDate,
            firstDayOfWeek,
            currentDate: now,
          })
        ) {
          dispatch(
            updateLastViewedCalendarDate({ year: now.year, month: now.month }),
          )
        }
        dispatch(setCartCalendarDatePickMode(true))
        dispatch(setCartCalendarDatePickLocalId(postcardLocalId ?? null))
      } else {
        dispatch(setCartCalendarDatePickMode(false))
      }
      onDateEdit?.()
    },
    [
      dispatch,
      dateEditHighlight,
      firstDayOfWeek,
      isBlockedEntry,
      lastViewedCalendarDate,
      notebookStripTab,
      onDateEdit,
      postcardLocalId,
    ],
  )

  return (
    <div
      className={styles.root}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-date-edit-active={
        isBlockedEntry && dateEditHighlight ? 'true' : undefined
      }
      data-inactive={variant === 'inactive' ? 'true' : undefined}
      data-clickable={interactive ? 'true' : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? labelForAria : undefined}
      onClick={interactive ? () => onSelect?.() : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect?.()
              }
            }
          : undefined
      }
    >
      <div className={styles.body}>
        <div className={styles.thumb} aria-hidden>
          {previewUrl ? (
            <img src={previewUrl} alt="" className={styles.thumbImg} />
          ) : null}
          {previewStatus && !previewIsProcessed ? (
            <span
              className={styles.statusIndicator}
              data-status={previewStatus}
              aria-hidden
            />
          ) : null}
        </div>
        <div className={styles.meta}>
          <div className={styles.dateLine}>{dateLabel}</div>
          {recipientParts ? (
            <div className={styles.detailBlock}>
              {recipientParts.region ? (
                <>
                  <span className={styles.detailName}>{recipientParts.name}</span>
                  <span className={styles.detailSep}>, </span>
                  <span className={styles.detailRegion}>
                    {recipientParts.region}
                  </span>
                </>
              ) : (
                <span className={styles.detailName}>{recipientParts.name}</span>
              )}
            </div>
          ) : null}
        </div>
        {priceLine ? (
          <div className={styles.priceLine} aria-label={`Price ${priceLine}`}>
            {priceLine}
          </div>
        ) : null}
        {isBlockedEntry ? (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.actionBtn}
              aria-label="Edit postcard date"
              title="Edit postcard date"
              aria-pressed={dateEditHighlight}
              onClick={handleDateEditClick}
            >
              {getToolbarIcon({ key: 'dateEdit' })}
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              aria-label="Remove postcard row"
              title="Remove postcard row"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
            >
              {getToolbarIcon({ key: 'delete' })}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
