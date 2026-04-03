import React from 'react'
import clsx from 'clsx'
import { useDateFacade } from '@date/application/facades'
import listOfMonthOfYear from '@/data/date/monthOfYear.json'
import styles from './MiniDate.module.scss'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { IconCalendarMulti } from '@shared/ui/icons'

interface MiniDateProps {}

export const MiniDate: React.FC<MiniDateProps> = () => {
  const { selectedDate, mergedDispatchDates } = useDateFacade()
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('date')
  const count = mergedDispatchDates.length

  if (count === 0) return null

  if (count > 1) {
    return (
      <div
        className={clsx(
          styles.miniDate,
          styles.miniDateMany,
          styles.visible,
          isHovered && styles.hovered,
        )}
        onMouseEnter={() => setHovered('date')}
        onMouseLeave={() => setHovered(null)}
      >
        <IconCalendarMulti className={styles.miniDateManyIcon} />
        <span className={styles.miniDateManyCount}>{count}</span>
      </div>
    )
  }

  const d = selectedDate ?? mergedDispatchDates[0]
  if (!d) return null

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
      <span className={styles.miniDateYear}>{d.year}</span>
      <span className={styles.miniDateDay}>{d.day}</span>
      <span className={styles.miniDateMonth}>
        {listOfMonthOfYear[d.month]}
      </span>
    </div>
  )
}
