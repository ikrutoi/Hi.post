import React from 'react'
import type { CardLetter } from '../domain/types'

interface Props {
  letters: CardLetter[]
  onLetterClick: (evt: React.MouseEvent<HTMLSpanElement>) => void
}

const CardScrollerLetters: React.FC<Props> = ({ letters, onLetterClick }) => {
  return (
    <div className="card-scroller__letters">
      {letters.map((card, i, arr) => {
        const isNew = i === 0 || card.letter !== arr[i - 1].letter
        const className = `card-scroller__letter${isNew ? '' : '--default'}`

        return (
          <span
            key={card.id}
            className={className}
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

export default CardScrollerLetters
