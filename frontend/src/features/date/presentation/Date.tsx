import React, { useCallback, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import { MONTH_NAMES } from '@entities/date/constants'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectCartItems, selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import {
  setCartListPanelOpen,
  setCartListStatusSegment,
} from '@cart/infrastructure/state'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state/sectionEditorMenuSlice'
import {
  closeDayPanel,
  setCartCalendarDatePickMode,
  setHistoryListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { selectIsHistoryListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { getCurrentDate } from '@shared/utils/date'
import { DateHeader } from '../dateHeader/presentation/DateHeader'
import { Calendar } from '../calendar/presentation/Calendar'
import { Slider } from '../slider/presentation/Slider'
import { useDateFacade } from '../application/facades/useDateFacade'
import { useCalendarFacade } from '../calendar/application/facades'
// import { useSizeFacade } from '@layout/application/facades'
import { useDateSwitcherController } from '../application/hooks'
import {
  useInitializeCalendarViewDate,
  useAutoActivateDateSection,
} from '../application/hooks'
import { useFlashEffect } from '@shared/hooks'
import { NotebookPeekShell } from './NotebookPeekShell'
import { PostcardStatusLegend } from './postcardStatusLegend/PostcardStatusLegend'
import { Toggle } from '@shared/ui/Toggle/Toggle'
import { IconHistory } from '@shared/ui/icons'
import styles from './Date.module.scss'
import type {
  CalendarViewDate,
  DispatchDate,
} from '@entities/date/domain/types'
import type { DateStripSection } from './dateStripSection.types'
import { POSTCARD_DISPATCH_DATE_FALLBACK } from '@entities/postcard'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import type { CardPieInnerData } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import { useSectionEditorNotebookTabsOuter } from '@features/cardSectionEditor/presentation/SectionEditorNotebookTabsOuterContext'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'

function isPeekDispatchDateFilled(d: DispatchDate | null | undefined): boolean {
  if (d == null) return false
  return !(
    d.year === POSTCARD_DISPATCH_DATE_FALLBACK.year &&
    d.month === POSTCARD_DISPATCH_DATE_FALLBACK.month &&
    d.day === POSTCARD_DISPATCH_DATE_FALLBACK.day
  )
}

function peekPrimaryDispatchDate(
  inner: CardPieInnerData | null,
): DispatchDate | null {
  if (inner == null) return null
  if (inner.dates.length > 0) {
    const first = inner.dates[0]
    if (isPeekDispatchDateFilled(first)) return first
  }
  if (isPeekDispatchDateFilled(inner.date)) return inner.date
  return null
}

export type { DateStripSection } from './dateStripSection.types'

export const Date: React.FC<{ section: DateStripSection }> = ({
  section,
}) => {
  const dispatch = useAppDispatch()
  const notebookTabsOuter = useSectionEditorNotebookTabsOuter()
  const {
    rightPieDatePeekNoToolbar,
    listRowInner,
    listRowLocalId,
  } = useRightListArchiveMini()
  const currentDate = useMemo(() => getCurrentDate(), [])
  const cartItems = useAppSelector(selectCartItems)
  const { flashParts, triggerFlash } = useFlashEffect()

  const {
    // isHistoryMode,
    chooseDate,
    // toggleHistoryMode,
  } = useDateFacade()

  // console.log('date', selectedDates)
  // const { sizeItemCalendar } = useSizeFacade()

  const { lastViewedCalendarDate } = useCalendarFacade()
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)

  /** Открытие/закрытие CartListPanel управляется явными действиями (toolbar/tabs/close), без авто-переоткрытия из центра. */

  /** Открытие/закрытие HistoryListPanel управляется явными действиями (toolbar/tabs/close), без авто-переоткрытия из центра. */

  const handleCalendarModeToggle = useCallback(
    (historyOn: boolean) => {
      if (historyOn) {
        dispatch(setActiveSection('history'))
        return
      }

      dispatch(setHistoryListPanelOpen(false))
      dispatch(closeDayPanel())
      dispatch(
        updateToolbarIcon({
          section: 'history',
          key: 'listHistory',
          value: 'enabled',
        }),
      )
      /**
       * Выключение истории — календарь в режиме корзины: открыть список корзины и секцию «Дата»
       * (`renderCardSection`: `date` + `cartListPanelOpen` → `<Date section="cart" />`).
       * `setActiveSection('cart')` нельзя: такого кейса в `renderCardSection` нет — рендерится `null`.
       */
      dispatch(setCartListPanelOpen(true))
      dispatch(setCartCalendarDatePickMode(false))
      dispatch(setCartListStatusSegment('cart'))
      dispatch(
        updateToolbarIcon({
          section: 'rightSidebar',
          key: 'cart',
          value: 'active',
        }),
      )
      dispatch(setActiveSection('date'))
    },
    [dispatch],
  )

  useInitializeCalendarViewDate()

  const { actions: actionsSwitcher, derived: derivedSwitcher } =
    useDateSwitcherController({ triggerFlash })
  const {
    handleDecrementArrow,
    handleIncrementArrow,
    goToTodayDate,
    goToSelectedDate,
    decrementMonth,
    incrementMonth,
    setCalendarViewDate,
  } = actionsSwitcher
  const { isCurrentMonth } = derivedSwitcher

  useAutoActivateDateSection()

  const peekDispatchDate = useMemo(
    () =>
      rightPieDatePeekNoToolbar &&
      (section === 'date' || section === 'cart' || section === 'history')
        ? peekPrimaryDispatchDate(listRowInner)
        : null,
    [rightPieDatePeekNoToolbar, section, listRowInner, listRowLocalId],
  )
  const peekDateDisabled = useMemo(() => {
    if (listRowLocalId == null) return false
    const postcard =
      cartItems.find(
        (p) =>
          p.localId === listRowLocalId &&
          (p.status === 'cart' || p.status === 'cartBlocked'),
      ) ??
      null
    if (postcard == null) return false
    return isDispatchDateDisabledForOrder(postcard.date, currentDate)
  }, [listRowLocalId, cartItems, currentDate])

  const fallbackCalendarViewDate = useMemo<CalendarViewDate>(
    () => ({ year: currentDate.year, month: currentDate.month }),
    [currentDate.year, currentDate.month],
  )
  const calendarViewDate: CalendarViewDate =
    lastViewedCalendarDate ?? fallbackCalendarViewDate

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!lastViewedCalendarDate) return
      const target = e.target as HTMLElement
      if (target.closest('input') || target.closest('button')) return

      const { year, month } = lastViewedCalendarDate
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          decrementMonth()
          break
        case 'ArrowRight':
          e.preventDefault()
          incrementMonth()
          break
        case 'ArrowUp':
          e.preventDefault()
          setCalendarViewDate({ year: year - 1, month })
          break
        case 'ArrowDown':
          e.preventDefault()
          setCalendarViewDate({ year: year + 1, month })
          break
      }
    },
    [
      lastViewedCalendarDate,
      decrementMonth,
      incrementMonth,
      setCalendarViewDate,
    ],
  )

  if (
    rightPieDatePeekNoToolbar &&
    (section === 'date' || section === 'cart' || section === 'history')
  ) {
    const d = peekDispatchDate
    const monthLabel =
      d != null &&
      d.month >= 0 &&
      d.month < MONTH_NAMES.length
        ? MONTH_NAMES[d.month]
        : ''
    const peekBody = (
      <div
        key={
          listRowLocalId != null ? `peek-date-${listRowLocalId}` : 'peek-date'
        }
        className={clsx(styles.form, styles.formPeek)}
      >
        {d != null ? (
          <div
            className={clsx(
              styles.peekDateStack,
              peekDateDisabled && styles.peekDateStackDisabled,
            )}
          >
            <div className={styles.peekYear}>{d.year}</div>
            <div className={styles.peekDay}>{d.day}</div>
            <div className={styles.peekMonth}>{monthLabel}</div>
          </div>
        ) : null}
      </div>
    )
    return (
      <div className={styles.date}>
        {notebookTabsOuter ? (
          peekBody
        ) : (
          <NotebookPeekShell section={section}>{peekBody}</NotebookPeekShell>
        )}
      </div>
    )
  }

  const calendarBody = (
        <form
          className={styles.form}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Calendar: left/right arrows - month, up/down - year"
        >
        <DateHeader
          dateSection={section}
          currentDate={currentDate}
          calendarViewDate={calendarViewDate}
          formattedSelectedDate={null}
          isCurrentMonth={isCurrentMonth}
          onDecrement={handleDecrementArrow}
          onIncrement={handleIncrementArrow}
          onGoToToday={goToTodayDate}
          onGoToSelected={goToSelectedDate}
          flashParts={flashParts}
        />

        <div className={styles.slider}>
          <Slider />
        </div>

        <div className={styles.calendar}>
          <Calendar
            calendarViewDate={calendarViewDate}
            chooseDate={chooseDate}
            triggerFlash={triggerFlash}
          />
        </div>

        <div className={styles.dateBottomToggle}>
          <div className={styles.dateBottomToggleIndicators}>
            <PostcardStatusLegend
              spot="calendar"
              isHistoryEmpty={false}
              calendarDispatchDimmed={section === 'date'}
              calendarCartStripLegendOnly={
                section === 'date' || section === 'cart'
              }
              calendarCartStripBlockedLegend={section === 'cart'}
            />
          </div>
          {section === 'date' ? (
            <div
              className={clsx(
                styles.dateBottomToggleGroup,
                styles.dateBottomToggleHistoryGroup,
                styles.dateBottomToggleDateFooterHidden,
              )}
              aria-hidden
              role="presentation"
            >
              <IconHistory
                className={clsx(
                  styles.dateBottomToggleIcon,
                  styles.dateBottomToggleHistoryIconShift,
                )}
                aria-hidden
              />
              <Toggle
                label=""
                checked={false}
                onChange={handleCalendarModeToggle}
                size="default"
                variant="dateHistory"
              />
            </div>
          ) : null}
        </div>

        </form>
  )

  return (
    <div className={styles.date}>
      {notebookTabsOuter ? (
        calendarBody
      ) : (
        <NotebookPeekShell section={section}>{calendarBody}</NotebookPeekShell>
      )}
    </div>
  )
}
