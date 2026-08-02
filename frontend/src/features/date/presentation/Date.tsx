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
import {
  selectIsHistoryListPanelOpen,
  selectRightListArchiveCardPieHighlightDispatchDate,
} from '@date/calendar/infrastructure/selectors'
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
import { IconHistory, IconPostcardNext } from '@shared/ui/icons'
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
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { MobileInlineToolbarRow } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { MobileDateCalendarToolbarSlider } from '@date/dateHeader/presentation/MobileDateCalendarToolbarSlider'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import {
  selectDraftDispatchDates,
  selectMergedDispatchDates,
} from '@date/infrastructure/selectors'
import {
  nextUniqueSelectedCalendarMonth,
  uniqueSelectedCalendarMonths,
} from '@date/application/helpers/selectedDatesMonthCycle'
import { buildDatePreviewLines } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import { DatePeekMultiBackground } from './DatePeekMultiBackground'
import {
  computeCartLegendStatusCounts,
  computeHistoryLegendStatusCounts,
} from '@date/application/helpers/legendStatusCounts'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'

const DateSectionShell: React.FC<{
  children: React.ReactNode
  showMobileSliderToolbar?: boolean
  stripSection: DateStripSection
}> = ({ children, showMobileSliderToolbar = false, stripSection }) => (
  <div className={styles.date} data-mobile-date-strip={stripSection}>
    <div className={styles.dateViewWrap}>
      <MobileInlineToolbarRow
        className={clsx(
          styles.dateToolbarRow,
          (stripSection === 'date' || stripSection === 'unblocked') &&
            styles.dateToolbarRowDate,
          stripSection === 'cart' && styles.dateToolbarRowCart,
          stripSection === 'history' && styles.dateToolbarRowHistory,
        )}
        emptyClassName={styles.dateToolbarRowEmpty}
        show={showMobileSliderToolbar}
      >
        <MobileDateCalendarToolbarSlider />
      </MobileInlineToolbarRow>
      <div className={styles.dateViewContent}>{children}</div>
    </div>
  </div>
)

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
    rightPieCardphotoPeekNoToolbar,
    rightPieCardtextPeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
    rightPieAromaPeekNoToolbar,
    listRowInner,
    listRowLocalId,
  } = useRightListArchiveMini()
  const { assemblyDateSimplifiedPeek } = useMobileFactoryListChrome()
  const appliedDispatchDates = useAppSelector(selectMergedDispatchDates)
  const draftDispatchDates = useAppSelector(selectDraftDispatchDates)
  const selectedDaysCount = draftDispatchDates.length
  const showSelectedDaysCount = selectedDaysCount > 1
  const selectedCalendarMonths = useMemo(
    () => uniqueSelectedCalendarMonths(draftDispatchDates),
    [draftDispatchDates],
  )
  const isMobileFactoryChromePeek =
    rightPieDatePeekNoToolbar ||
    rightPieCardphotoPeekNoToolbar ||
    rightPieCardtextPeekNoToolbar ||
    rightPieEnvelopePeekNoToolbar ||
    rightPieAromaPeekNoToolbar
  /** Peek фабрики из CardPie: боковые полосы секции «Дата», не strip корзины/истории. */
  const gutterStripSection: DateStripSection =
    isMobileFactoryChromePeek || assemblyDateSimplifiedPeek ? 'date' : section
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
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const { legendStatusCounts, historyUnderlyingPostcardCount } = useMemo(
    () => computeHistoryLegendStatusCounts(cartItems),
    [cartItems],
  )
  const { legendStatusCounts: cartLegendStatusCounts, cartUnderlyingPostcardCount } =
    useMemo(() => computeCartLegendStatusCounts(cartItems), [cartItems])
  const showMobileSliderToolbar =
    isMobileLayout && !rightPieDatePeekNoToolbar && !assemblyDateSimplifiedPeek

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

  const peekDispatchDate = useMemo(() => {
    if (
      rightPieDatePeekNoToolbar &&
      (section === 'date' ||
        section === 'cart' ||
        section === 'history' ||
        section === 'unblocked')
    ) {
      return peekPrimaryDispatchDate(listRowInner)
    }
    if (assemblyDateSimplifiedPeek && appliedDispatchDates.length > 0) {
      return appliedDispatchDates[0] ?? null
    }
    return null
  }, [
    rightPieDatePeekNoToolbar,
    assemblyDateSimplifiedPeek,
    appliedDispatchDates,
    section,
    listRowInner,
    listRowLocalId,
  ])
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

  /** `unblocked`: месяц/год открытки из центрального CardPie (просроченная дата). */
  const archivePostcardDispatchDate = useAppSelector(
    selectRightListArchiveCardPieHighlightDispatchDate,
  )
  const unblockedPostcardMonth = useMemo((): CalendarViewDate | null => {
    if (section !== 'unblocked' || archivePostcardDispatchDate == null) {
      return null
    }
    return {
      year: archivePostcardDispatchDate.year,
      month: archivePostcardDispatchDate.month,
    }
  }, [section, archivePostcardDispatchDate])

  /**
   * Enabled, если есть куда перейти:
   * - `unblocked` — вид ≠ месяц/год открытки в CardPie;
   * - иначе — другой месяц+год с выбранными датами (в т.ч. одна дата вне текущего вида).
   */
  const canNavigateSelectedMonths = useMemo(() => {
    if (section === 'unblocked') {
      if (unblockedPostcardMonth == null) return false
      return (
        unblockedPostcardMonth.year !== calendarViewDate.year ||
        unblockedPostcardMonth.month !== calendarViewDate.month
      )
    }
    return (
      nextUniqueSelectedCalendarMonth(
        selectedCalendarMonths,
        calendarViewDate,
      ) != null
    )
  }, [
    section,
    unblockedPostcardMonth,
    selectedCalendarMonths,
    calendarViewDate,
  ])

  const handleCycleSelectedMonths = useCallback(() => {
    if (!canNavigateSelectedMonths) return
    if (section === 'unblocked') {
      if (unblockedPostcardMonth == null) return
      setCalendarViewDate(unblockedPostcardMonth)
      return
    }
    const next = nextUniqueSelectedCalendarMonth(
      selectedCalendarMonths,
      calendarViewDate,
    )
    if (next == null) return
    if (
      next.year === calendarViewDate.year &&
      next.month === calendarViewDate.month
    ) {
      return
    }
    setCalendarViewDate(next)
  }, [
    canNavigateSelectedMonths,
    section,
    unblockedPostcardMonth,
    selectedCalendarMonths,
    calendarViewDate,
    setCalendarViewDate,
  ])

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
    (rightPieDatePeekNoToolbar || assemblyDateSimplifiedPeek) &&
    (section === 'date' ||
      section === 'cart' ||
      section === 'history' ||
      section === 'unblocked')
  ) {
    const peekDates =
      assemblyDateSimplifiedPeek && appliedDispatchDates.length > 0
        ? appliedDispatchDates
        : listRowInner?.dates ?? []
    const isMultiDatePeek = peekDates.length > 1
    const d = peekDispatchDate
    const monthLabel =
      d != null &&
      d.month >= 0 &&
      d.month < MONTH_NAMES.length
        ? MONTH_NAMES[d.month]
        : ''
    const dayLabels = buildDatePreviewLines(peekDates)
    const peekBody = (
      <div className={clsx(styles.form, styles.formPeek)}>
        {isMultiDatePeek ? (
          <div className={styles.peekMulti}>
            <DatePeekMultiBackground
              dayLabels={dayLabels}
              seed={`date-peek-${dayLabels.join('\u0000')}`}
            />
            <div className={styles.peekMultiCount}>{peekDates.length}</div>
          </div>
        ) : d != null ? (
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
      <DateSectionShell
        key={
          listRowLocalId != null ? `peek-date-${listRowLocalId}` : 'peek-date'
        }
        showMobileSliderToolbar={false}
        stripSection={gutterStripSection}
      >
        {notebookTabsOuter ? (
          peekBody
        ) : (
          <NotebookPeekShell section={section}>{peekBody}</NotebookPeekShell>
        )}
      </DateSectionShell>
    )
  }

  const calendarBody = (
        <form
          className={styles.form}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Calendar: left/right arrows - month, up/down - year"
        >
        {!isMobileLayout ? (
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
        ) : null}

        {!isMobileLayout ? (
          <div className={styles.slider}>
            <Slider />
          </div>
        ) : null}

        <div className={styles.calendar}>
          <Calendar
            calendarViewDate={calendarViewDate}
            chooseDate={chooseDate}
            triggerFlash={triggerFlash}
          />

        <div
          className={clsx(
            styles.dateBottomToggle,
            (section === 'cart' || section === 'history') &&
              styles.dateBottomToggleCartHistory,
          )}
        >
          {section === 'cart' || section === 'history' ? (
            <div className={styles.historyFooterIndicators}>
              <div className={styles.historyFooterIndicatorsInner}>
                <PostcardStatusLegend
                  spot="historyList"
                  isHistoryEmpty={
                    (section === 'history' &&
                      historyUnderlyingPostcardCount === 0) ||
                    (section === 'cart' && cartUnderlyingPostcardCount === 0)
                  }
                  statusCounts={
                    section === 'history'
                      ? legendStatusCounts
                      : cartLegendStatusCounts
                  }
                  calendarCartStripLegendOnly={section === 'cart'}
                  calendarCartStripBlockedLegend={section === 'cart'}
                  calendarHistoryStripLegend={section === 'history'}
                  calendarCartHistoryFooter
                  calendarFooterAlwaysEnabled
                />
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                className={styles.dateBottomPostcardNextGroup}
                onClick={handleCycleSelectedMonths}
                disabled={!canNavigateSelectedMonths}
                aria-label={
                  section === 'unblocked'
                    ? canNavigateSelectedMonths
                      ? 'Go to postcard month'
                      : 'Postcard month'
                    : canNavigateSelectedMonths
                      ? 'Next month with selected dates'
                      : 'Selected dates'
                }
              >
                <IconPostcardNext
                  className={clsx(
                    styles.dateBottomPostcardNext,
                    canNavigateSelectedMonths
                      ? styles.dateBottomPostcardNextEnabled
                      : styles.dateBottomPostcardNextDisabled,
                  )}
                  aria-hidden
                />
                {showSelectedDaysCount ? (
                  <span className={styles.dateBottomPostcardNextCount}>
                    {selectedDaysCount}
                  </span>
                ) : null}
              </button>
              <div className={styles.dateBottomToggleIndicators}>
                <PostcardStatusLegend
                  spot="calendar"
                  isHistoryEmpty={false}
                  calendarDispatchDimmed={
                    section === 'date' || section === 'unblocked'
                  }
                  calendarCartStripLegendOnly={
                    section === 'date' || section === 'unblocked'
                  }
                />
              </div>
            </>
          )}
          {section === 'date' || section === 'unblocked' ? (
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
        </div>

        </form>
  )

  return (
    <DateSectionShell showMobileSliderToolbar={showMobileSliderToolbar} stripSection={gutterStripSection}>
      {notebookTabsOuter ? (
        calendarBody
      ) : (
        <NotebookPeekShell section={section}>{calendarBody}</NotebookPeekShell>
      )}
    </DateSectionShell>
  )
}
