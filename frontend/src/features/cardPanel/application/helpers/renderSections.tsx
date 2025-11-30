import React from 'react'
import clsx from 'clsx'
import styles from '../../presentation/EnvelopeOverlay.module.scss'
import type { CardSection } from '@entities/card/domain/types'

const SECTION_MAP: Record<CardSection, string> = {
  cardphoto: styles.sectionCardphoto,
  cardtext: styles.sectionCardtext,
  envelope: styles.sectionEnvelope,
  aroma: styles.sectionAroma,
  date: styles.sectionDate,
}

export function renderSections(completedSections: CardSection[]) {
  return (Object.keys(SECTION_MAP) as CardSection[]).map((sectionKey) => (
    <div
      key={sectionKey}
      className={clsx(
        styles.section,
        SECTION_MAP[sectionKey],
        completedSections.includes(sectionKey) && styles.completed
      )}
    />
  ))
}
