import React from 'react'
import styles from './WeekdayHeaderCell.module.scss'
import type { DaysOfWeek } from '@entities/date/domain/types'

interface WeekdayHeaderCellProps {
  weekday: DaysOfWeek
}

export const WeekdayHeaderCell: React.FC<WeekdayHeaderCellProps> = ({
  weekday,
}) => {
  return <div className={styles.cell}>{weekday}</div>
}
