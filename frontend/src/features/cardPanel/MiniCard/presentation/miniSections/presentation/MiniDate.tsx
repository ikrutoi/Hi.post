import React from 'react'
import clsx from 'clsx'
import { useDateFacade } from '@date/application/facades'
import listOfMonthOfYear from '@/data/date/monthOfYear.json'
import styles from './MiniDate.module.scss'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { getDateMultiMiniCircleSteps } from './concentricCircleSteps'

interface MiniDateProps {}

export const MiniDate: React.FC<MiniDateProps> = () => {
  const { selectedDate, mergedDispatchDates, isMultiDateMode } = useDateFacade()
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('date')
  const count = mergedDispatchDates.length

  if (count === 0) return null

  const showSingleLayout = !isMultiDateMode || count === 1

  if (showSingleLayout) {
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

  const circleCount = Math.min(count, 10)
  const { steps } = getDateMultiMiniCircleSteps(circleCount)

  return (
    <div
      className={clsx(
        styles.miniDate,
        styles.miniDateManyCircles,
        styles.visible,
        isHovered && styles.hovered,
      )}
      onMouseEnter={() => setHovered('date')}
      onMouseLeave={() => setHovered(null)}
    >
      {steps.length > 0 && (
        <div className={styles.miniDateCircles} aria-hidden>
          {steps.map((step, i) => (
            <span
              key={i}
              className={styles.miniDateCircle}
              style={{
                width: `${step.sizePercent}%`,
                maxHeight: `${step.sizePercent}%`,
                aspectRatio: 1,
                opacity: step.opacity,
              }}
            />
          ))}
        </div>
      )}
      <div className={styles.miniDateCount}>
        <span>{count}</span>
      </div>
    </div>
  )
}
