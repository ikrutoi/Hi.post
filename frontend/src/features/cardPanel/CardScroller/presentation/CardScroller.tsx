import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import {
  useCardScrollerThumbWidth,
  useCardScrollerDelta,
} from '../application/hooks'
import { CardScrollerLetters } from './CardScrollerLetters'
import styles from './CardScroller.module.scss'
import type { CardScrollerProps } from '../domain/types'

export const CardScroller: React.FC<CardScrollerProps> = ({
  value,
  scrollIndex,
  maxMiniCardsCount,
  deltaEnd,
  handleChangeFromSliderCardsList,
  onLetterClick,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [indexLetter, setIndexLetter] = useState<number>(0)

  const isActive =
    scrollIndex != null &&
    maxMiniCardsCount != null &&
    scrollIndex.totalCount > maxMiniCardsCount

  const thumbWidth = useCardScrollerThumbWidth(
    sliderRef,
    isActive ? scrollIndex.totalCount : 0,
    maxMiniCardsCount ?? 0,
    isActive && deltaEnd != null ? deltaEnd : 0,
  )

  useCardScrollerDelta(
    scrollIndex?.totalCount ?? 0,
    indexLetter,
    maxMiniCardsCount ?? 0,
  )

  const maxVal = isActive && scrollIndex
    ? Math.max(0, scrollIndex.totalCount - maxMiniCardsCount + 1)
    : 0
  const inputValue = isActive && scrollIndex
    ? ((deltaEnd ?? 0) > 0 ? value + 1 : value) || 0
    : 0

  return (
    <div
      className={clsx(styles['card-scroller__container'], {
        [styles['card-scroller--active']]: isActive && thumbWidth != null && thumbWidth > 0,
        [styles['card-scroller--inactive']]: !isActive,
      })}
      ref={sliderRef}
    >
      {isActive && thumbWidth != null && thumbWidth > 0 && (
        <style>
          {`
            .${styles['card-scroller__slider']}::-webkit-slider-thumb {
              width: ${thumbWidth}px;
            }
          `}
        </style>
      )}
      <input
        type="range"
        className={clsx(styles['card-scroller__slider'], {
          [styles['card-scroller__slider--shifted']]: isActive && (deltaEnd ?? 0) > 0,
        })}
        min={0}
        max={maxVal}
        value={inputValue}
        disabled={!isActive}
        onChange={(evt) => handleChangeFromSliderCardsList(evt.target.value)}
      />
      {isActive && scrollIndex?.firstLetters != null ? (
        <CardScrollerLetters
          firstLetters={scrollIndex.firstLetters}
          onLetterClick={(evt) => {
            const index = Number((evt.currentTarget as HTMLElement).dataset.index)
            setIndexLetter(index)
            onLetterClick(evt)
          }}
        />
      ) : (
        <div className={styles['card-scroller__letters-placeholder']} aria-hidden />
      )}
    </div>
  )
}
