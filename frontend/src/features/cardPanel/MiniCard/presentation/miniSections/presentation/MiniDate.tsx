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

  const showTextLayout = !isMultiDateMode

  if (showTextLayout) {
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
  const isSingleMulti = count === 1
  const oneMultiDate = isSingleMulti
    ? (selectedDate ?? mergedDispatchDates[0])
    : null

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
        <div
          key={isSingleMulti ? 'single' : 'multi'}
          className={clsx(
            styles.miniDateCircles,
            isSingleMulti && styles.miniDateSingleCircles,
          )}
          aria-hidden
        >
          {steps.map((step, i) => (
            <span
              key={i}
              className={styles.miniDateCircle}
              style={{
                width: `${step.sizePercent}%`,
                maxHeight: `${step.sizePercent}%`,
                aspectRatio: 1,
                ...(isSingleMulti ? {} : { opacity: step.opacity }),
              }}
            />
          ))}
        </div>
      )}
      {isSingleMulti && oneMultiDate ? (
        <div className={styles.miniDateOneDateInMulti}>
          <span className={styles.miniDateYear}>{oneMultiDate.year}</span>
          <span className={styles.miniDateDay}>{oneMultiDate.day}</span>
          <span className={styles.miniDateMonth}>
            {listOfMonthOfYear[oneMultiDate.month]}
          </span>
        </div>
      ) : (
        <div className={styles.miniDateCount}>
          <span>{count}</span>
        </div>
      )}
    </div>
  )
}
