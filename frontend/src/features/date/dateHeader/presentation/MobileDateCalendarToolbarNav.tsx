import React, { useMemo } from 'react'
import { useCalendarFacade } from '@date/calendar/application/facades'
import { useInitializeCalendarViewDate } from '@date/application/hooks/useInitializeCalendarViewDate'
import { useDateSwitcherController } from '@date/switcher/application/hooks/useDateSwitcherController'
import { useFlashEffect } from '@shared/hooks'
import { getCurrentDate } from '@shared/utils/date'
import { DateHeaderNavigation } from './DateHeaderNavigation'
import headerStyles from './DateHeader.module.scss'
import type { CalendarViewDate } from '@entities/date/domain/types'
import styles from './MobileDateCalendarToolbarNav.module.scss'

export const MobileDateCalendarToolbarNav: React.FC = () => {
  const { triggerFlash } = useFlashEffect()
  const { lastViewedCalendarDate } = useCalendarFacade()
  const currentDate = useMemo(() => getCurrentDate(), [])
  const fallbackCalendarViewDate = useMemo<CalendarViewDate>(
    () => ({ year: currentDate.year, month: currentDate.month }),
    [currentDate.year, currentDate.month],
  )
  const calendarViewDate = lastViewedCalendarDate ?? fallbackCalendarViewDate
  const {
    actions: { handleDecrementArrow, handleIncrementArrow },
  } = useDateSwitcherController({ triggerFlash })

  useInitializeCalendarViewDate()

  return (
    <div className={styles.root}>
      <DateHeaderNavigation
        className={headerStyles.headerCenterToolbarSwitcherOnly}
        switcherVariant="toolbar"
        calendarViewDate={calendarViewDate}
        onDecrement={handleDecrementArrow}
        onIncrement={handleIncrementArrow}
        showArrows={false}
      />
    </div>
  )
}
