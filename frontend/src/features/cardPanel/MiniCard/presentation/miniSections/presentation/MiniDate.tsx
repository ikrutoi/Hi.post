import React from 'react'
import styles from './MiniDate.module.scss'
import listOfMonthOfYear from '@/data/date/monthOfYear.json'

interface MiniDateProps {
  valueSection: {
    year: string
    day: string
    month: string
  }
  heightMinicard: number
}

export const MiniDate: React.FC<MiniDateProps> = ({
  valueSection,
  heightMinicard,
}) => {
  return (
    <div className={styles.miniDate}>
      <span className={styles.miniDate__year}>{valueSection.year}</span>
      <span className={styles.miniDate__day}>{valueSection.day}</span>
      <span className={styles.miniDate__month}>
        {listOfMonthOfYear[valueSection.month]}
      </span>
    </div>
  )
}
