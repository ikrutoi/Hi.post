import React from 'react'
import styles from './SectionPresets.module.scss'
import { SectionPreset, PresetSource } from '../domain/types'
import { trimLines } from '../application/helpers/trimLines'
import shotMonths from '@data/date/monthsShotOfYear.json'

interface Props {
  card: SectionPreset
  index: number
  section: PresetSource
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
  const memorySections = ['shopping', 'blanks']
  const id = card.id

  return (
    <div
      className={`${styles['section-presets__card']} ${styles[`section-presets__card--${section}`]}`}
      ref={refs.cardRef}
      data-id={id}
      data-index={index}
      data-personal-id={card.personalId}
      style={{ width: size.width, height: size.height }}
      onClick={() => onClick(String(id))}
    >
      {memorySections.includes(section) && (
        <>
          <div
            className={styles['section-presets__filter']}
            ref={refs.filterRef}
            data-id={id}
          />
          <img
            className={styles['section-presets__photo']}
            src={URL.createObjectURL(card[section].cardphoto)}
            alt="memoryCardPhoto"
            style={{ width: size.width, height: size.height }}
          />
          {section === 'shopping' && card.shopping?.date && (
            <span className={styles['section-presets__date-container']}>
              <span className={styles['section-presets__date']}>
                {card.shopping.date.year}
              </span>
              <span className={styles['section-presets__date']}>
                {'\xA0'}
                {shotMonths[card.shopping.date.month]}
                {'\xA0'}
              </span>
              <span className={styles['section-presets__date']}>
                {card.shopping.date.day}
              </span>
            </span>
          )}
          <span
            className={`${styles['section-presets__name']} ${styles[`section-presets__name--${section}`]}`}
          >
            {trimLines(section, card[section].envelope.toaddress.name)}
          </span>
        </>
      )}
    </div>
  )
}
