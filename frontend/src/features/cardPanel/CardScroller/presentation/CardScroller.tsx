import React, { useRef, useState } from 'react'
import styles from './CardScroller.module.scss'

import {
  useCardScrollerThumbWidth,
  useCardScrollerDelta,
} from '../application/hooks'
import CardScrollerLetters from './CardScrollerLetters'
import type { CardScrollerProps } from '../domain/types'

export const CardScroller: React.FC<CardScrollerProps> = ({
  value,
  infoCardsList,
  maxCardsList,
  deltaEnd,
  handleChangeFromSliderCardsList,
  onLetterClick,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [indexLetter, setIndexLetter] = useState<number>(0)

  const thumbWidth = useCardScrollerThumbWidth(
    sliderRef,
    infoCardsList.length,
    maxCardsList,
    deltaEnd
  )

  useCardScrollerDelta(infoCardsList.length, indexLetter, maxCardsList)

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
        max={infoCardsList.length - maxCardsList + 1}
        value={(deltaEnd ? value + 1 : value) || 0}
        onChange={(evt) => handleChangeFromSliderCardsList(evt.target.value)}
      />
      <CardScrollerLetters
        letters={infoCardsList.firstLetters}
        onLetterClick={(evt) => {
          const index = Number(evt.currentTarget.dataset.index)
          setIndexLetter(index)
          onLetterClick(evt)
        }}
      />
    </div>
  )
}
