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

  if (!maxMiniCardsCount || !deltaEnd || !scrollIndex) return null

  const thumbWidth = useCardScrollerThumbWidth(
    sliderRef,
    scrollIndex.totalCount,
    maxMiniCardsCount,
    deltaEnd
  )

  useCardScrollerDelta(scrollIndex.totalCount, indexLetter, maxMiniCardsCount)

  return (
    <div
      className={clsx(styles['card-scroller__container'], {
        [styles['card-scroller--active']]:
          thumbWidth !== null && thumbWidth > 0,
      })}
      ref={sliderRef}
    >
      {thumbWidth && (
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
          [styles['card-scroller__slider--shifted']]: deltaEnd,
        })}
        min={0}
        max={scrollIndex.totalCount - maxMiniCardsCount + 1}
        value={(deltaEnd ? value + 1 : value) || 0}
        onChange={(evt) => handleChangeFromSliderCardsList(evt.target.value)}
      />
      <CardScrollerLetters
        firstLetters={scrollIndex.firstLetters}
        onLetterClick={(evt) => {
          const index = Number(evt.currentTarget.dataset.index)
          setIndexLetter(index)
          onLetterClick(evt)
        }}
      />
    </div>
  )
}
