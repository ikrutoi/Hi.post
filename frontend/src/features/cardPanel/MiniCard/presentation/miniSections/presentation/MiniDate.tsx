import React from 'react'
import { useDateFacade } from '@date/application/facades'
import listOfMonthOfYear from '@/data/date/monthOfYear.json'
import styles from './MiniDate.module.scss'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import clsx from 'clsx'

interface MiniDateProps {}

export const MiniDate: React.FC<MiniDateProps> = () => {
  const { state: stateDate } = useDateFacade()
  const { selectedDate } = stateDate
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('date')

  if (!selectedDate) return

  return (
    <div
      className={clsx(
        styles.miniDate,
        styles.visible,
        isHovered && styles.hovered,
      )}
      onMouseEnter={() => setHovered('date')}
      onMouseLeave={() => setHovered(null)}
    >
      <span className={styles.miniDateYear}>{selectedDate.year}</span>
      <span className={styles.miniDateDay}>{selectedDate.day}</span>
      <span className={styles.miniDateMonth}>
        {listOfMonthOfYear[selectedDate.month]}
      </span>
    </div>
  )
}
