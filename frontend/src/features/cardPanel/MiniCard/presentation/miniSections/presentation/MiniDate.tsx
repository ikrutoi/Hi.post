import React from 'react'
import { useDateFacade } from '@date/application/facades'
import styles from './MiniDate.module.scss'
import listOfMonthOfYear from '@/data/date/monthOfYear.json'

interface MiniDateProps {
  // valueSection: {
  //   year: string
  //   day: string
  //   month: string
  // }
  heightMinicard: number
}

export const MiniDate: React.FC<MiniDateProps> = ({
  // valueSection,
  heightMinicard,
}) => {
  const { state: stateDate } = useDateFacade()
  const { selectedDispatchDate } = stateDate

  if (!selectedDispatchDate) return

  return (
    <div className={styles.miniDate}>
      <span className={styles.miniDateYear}>{selectedDispatchDate.year}</span>
      <span className={styles.miniDateDay}>{selectedDispatchDate.day}</span>
      <span className={styles.miniDateMonth}>
        {listOfMonthOfYear[selectedDispatchDate.month]}
      </span>
    </div>
  )
}
