import React, { useEffect } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { MONTH_NAMES } from '@entities/date/constants'
import { formatSelectedDispatchDate } from '@entities/date/utils'
import { useLayoutFacade } from '@layout/application/facades'
import { themeColors } from '@shared/config/theme/themeColors'
import { getCurrentDate } from '@shared/utils/date'
import { Calendar } from '../calendar/presentation/Calendar'
import { Slider } from '../slider/presentation/Slider'
import { Switcher } from '../switcher/presentation/Switcher'
import { useDateFacade } from '../application/facades/useDateFacade'
import { useDateSwitcherController } from '../application/hooks'
import { LuCalendar, LuCalendarArrowUp } from 'react-icons/lu'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styles from './Date.module.scss'

export const Date: React.FC = () => {
  const currentDate = getCurrentDate()

  const {
    section: { activeSection },
    actions: { setActiveSection },
  } = useLayoutFacade()

  const { state: stateDate, actions: actionsDate } = useDateFacade()
  const { selectedDispatchDate } = stateDate
  const { setSelectedDispatchDate, resetSelectedDispatchDate } = actionsDate

  const { state: stateSwitcher, actions: actionsSwitcher } =
    useDateSwitcherController()
  const {} = stateSwitcher
  const {} = actionsSwitcher

  useEffect(() => {
    if (selectedDispatchDate) {
      setActiveSection('date')
    }
  }, [selectedDispatchDate])

  return (
    <div className={styles.date}>
      <div className={styles.navContainer}>
        {activeSection && <Toolbar section={activeSection} />}
      </div>

      <form className={styles.form}>
        <div className={styles.header}>
          <div className={styles.headerSide}>
            <div
              className={clsx(styles['today-selected'], {
                [styles['today-selected--disabled']]: isCurrentMonth(),
              })}
              onClick={goToTodayDate}
              style={{
                color: isCurrentMonth()
                  ? themeColors.text.secondary
                  : themeColors.text.primary,
                cursor: isCurrentMonth() ? 'default' : 'pointer',
              }}
            >
              <LuCalendar className={styles.iconTitle} />
              {`${currentDate.currentYear} ${MONTH_NAMES[currentDate.currentMonth]} ${currentDate.currentDay}`}
            </div>
          </div>

          <div className={styles.headerCenter}>
            <div
              className={clsx(styles.arrowButton, {
                [styles['arrow-button--inactive']]: !activeDateTitleRole,
              })}
              onClick={handleDecrementArrow}
            >
              <FaChevronLeft className={styles.iconArrow} />
            </div>

            <div className={styles.switcher}>
              <Switcher
                dispatchDateTitle={dispatchDateTitle}
                activeDateTitleRole={activeDateTitleRole}
                onToggleRole={toggleActiveDateRole}
              />
            </div>

            <div
              className={styles.arrowButton}
              style={{
                color: activeDateTitleRole
                  ? themeColors.text.primary
                  : themeColors.text.secondary,
                backgroundColor: themeColors.background.default,
                cursor: 'pointer',
              }}
              onClick={handleIncrementArrow}
            >
              <FaChevronRight className={styles.iconArrow} />
            </div>
          </div>

          <div className={styles.headerSide}>
            <div className={styles.selected} onClick={goToSelectedDate}>
              {selectedDispatchDate && (
                <>
                  <LuCalendarArrowUp className={styles.iconTitle} />
                  {selectedDispatchDate &&
                    formatSelectedDispatchDate(selectedDispatchDate)}
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.slider}>
          <Slider
            dispatchDateTitle={dispatchDateTitle}
            activeDateTitleRole={activeDateTitleRole}
            onChange={handleSliderChange}
          />
        </div>

        <div className={styles.calendar}>
          <Calendar
            selectedDispatchDate={selectedDispatchDate}
            setSelectedDispatchDate={setSelectedDispatchDate}
            resetSelectedDispatchDate={resetSelectedDispatchDate}
            handleClickCell={handleCalendarCellClick}
          />
        </div>
      </form>
    </div>
  )
}
