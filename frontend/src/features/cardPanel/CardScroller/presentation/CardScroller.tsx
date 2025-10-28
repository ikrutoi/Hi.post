import React, { useRef, useState } from 'react'
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
  maxCardsList,
  deltaEnd,
  handleChangeFromSliderCardsList,
  onLetterClick,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [indexLetter, setIndexLetter] = useState<number>(0)

  if (!maxCardsList || !deltaEnd || !scrollIndex) return

  const thumbWidth = useCardScrollerThumbWidth(
    sliderRef,
    scrollIndex.totalCount,
    maxCardsList,
    deltaEnd
  )

  useCardScrollerDelta(scrollIndex.totalCount, indexLetter, maxCardsList)

  return (
    <div className={styles['card-scroller__container']} ref={sliderRef}>
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
        className={styles['card-scroller__slider']}
        min={0}
        max={scrollIndex.totalCount - maxCardsList + 1}
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
