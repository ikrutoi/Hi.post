import React from 'react'
import clsx from 'clsx'
import styles from './CardScroller.module.scss'
import type { CardLetter } from '../domain/types'

interface Props {
  firstLetters: CardLetter[]
  onLetterClick: (evt: React.MouseEvent<HTMLSpanElement>) => void
}

export const CardScrollerLetters: React.FC<Props> = ({
  firstLetters,
  onLetterClick,
}) => {
  return (
    <div className={styles['card-scroller__letters']}>
      {firstLetters.map((card, i, arr) => {
        const isNew = i === 0 || card.letter !== arr[i - 1].letter

        return (
          <span
            key={card.id}
            className={clsx(styles['card-scroller__letter'], {
              [styles['card-scroller__letter--default']]: !isNew,
            })}
            onClick={onLetterClick}
            data-id={card.id}
            data-index={card.index}
          >
            {isNew ? card.letter : null}
          </span>
        )
      })}
    </div>
  )
}
