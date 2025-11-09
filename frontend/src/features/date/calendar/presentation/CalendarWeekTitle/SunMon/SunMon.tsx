import React from 'react'
import clsx from 'clsx'
import { FirstDay } from '@entities/date/domain/types'
import styles from './SunMon.module.scss'

interface SunMonProps {
  firstDayTitle: FirstDay
  handleFirstDay: (day: FirstDay) => void
}

export const SunMon: React.FC<SunMonProps> = ({
  firstDayTitle,
  handleFirstDay,
}) => {
  const handleFirstDayOfWeek = () => {
    handleFirstDay(firstDayTitle === 'Sun' ? 'Mon' : 'Sun')
  }

  return (
    <div
      className={clsx(styles['sun-mon__toggle'])}
      onClick={handleFirstDayOfWeek}
    >
      <span className={styles['sun-mon__label']}>{firstDayTitle}</span>
    </div>
  )
}
