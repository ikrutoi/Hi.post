import React from 'react'
import { useDateFacade } from '@date/application/facades'
import listOfMonthOfYear from '@/data/date/monthOfYear.json'
import styles from './MiniDate.module.scss'

interface MiniDateProps {}

export const MiniDate: React.FC<MiniDateProps> = () => {
  const { state: stateDate } = useDateFacade()
  const { selectedDate } = stateDate

  if (!selectedDate) return

  return (
    <div className={styles.miniDate}>
      <span className={styles.miniDateYear}>{selectedDate.year}</span>
      <span className={styles.miniDateDay}>{selectedDate.day}</span>
      <span className={styles.miniDateMonth}>
        {listOfMonthOfYear[selectedDate.month]}
      </span>
    </div>
  )
}
