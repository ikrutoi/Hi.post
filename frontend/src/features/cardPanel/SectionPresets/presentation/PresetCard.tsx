import React from 'react'
import styles from './SectionPresets.module.scss'
import type { CardItem } from '@entities/card/domain/types'
import type { Template } from '@shared/config/constants'
import { trimLines } from '../application/helpers/trimLines'
import shotMonths from '@data/date/monthsShotOfYear.json'

interface Props {
  card: CardItem
  index: number
  section: Template
  size: { width: number; height: number }
  remSize: number
  refs: {
    cardRef: (el: HTMLElement | null) => void
    filterRef?: (el: HTMLElement | null) => void
    spanNameRef?: (el: HTMLElement | null) => void
  }
  onClick: (id: string) => void
}

export const PresetCard: React.FC<Props> = ({
  card,
  index,
  section,
  size,
  remSize,
  refs,
  onClick,
}) => {
  const source = ['cart', 'drafts']
  const id = card.id

  return (
    <div
      className={`${styles['section-presets__card']} ${styles[`section-presets__card--${section}`]}`}
      ref={refs.cardRef}
      data-id={id}
      data-index={index}
      data-personal-id={card.id}
      style={{ width: size.width, height: size.height }}
      onClick={() => onClick(String(id))}
    >
      {source.includes(section) && (
        <>
          <div
            className={styles['section-presets__filter']}
            ref={refs.filterRef}
            data-id={id}
          />
          {section === 'cardphoto' && card.cardphoto.isComplete && (
            <img
              className={styles['section-presets__photo']}
              src={URL.createObjectURL(card.cardphoto.data.url)}
              alt="memoryCardPhoto"
              style={{ width: size.width, height: size.height }}
            />
          )}
          {section === 'cart' &&
            card.date.isComplete &&
            card.date.data.isSelected && (
              <span className={styles['section-presets__date-container']}>
                <span className={styles['section-presets__date']}>
                  {card.date.data.year}
                </span>
                <span className={styles['section-presets__date']}>
                  {'\xA0'}
                  {shotMonths[card.date.data.month]}
                  {'\xA0'}
                </span>
                <span className={styles['section-presets__date']}>
                  {card.date.data.day}
                </span>
              </span>
            )}
          <span
            className={`${styles['section-presets__name']} ${styles[`section-presets__name--${section}`]}`}
          >
            {section === 'recipient' &&
              card.envelope.isComplete &&
              trimLines(section, card.envelope.data.recipient.name)}
          </span>
        </>
      )}
    </div>
  )
}
