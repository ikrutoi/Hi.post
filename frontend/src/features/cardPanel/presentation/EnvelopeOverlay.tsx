import React from 'react'
import clsx from 'clsx'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import EnvelopeIcon from '@assets/illustration/EnvelopeIcon'
import { renderSections } from '../application/helpers'
import styles from './EnvelopeOverlay.module.scss'
import type { SizeCard } from '@layout/domain/types'
import type { CardSection } from '@entities/card/domain/types'

interface EnvelopeOverlayProps {
  sizeMiniCard: SizeCard
  completedSections: CardSection[]
}

export const EnvelopeOverlay: React.FC<EnvelopeOverlayProps> = ({
  sizeMiniCard,
  completedSections,
}) => {
  if (!sizeMiniCard?.width || !sizeMiniCard?.height) return null

  return (
    <div
      className={styles.envelopeOverlay}
      style={{
        height: `${sizeMiniCard.height}px`,
        width: `${sizeMiniCard.width}px`,
      }}
    >
      <div className={styles.envelopeOverlaySections}>
        {renderSections(completedSections)}
      </div>
      <EnvelopeIcon className={styles.envelopeIcon} />
      <div className={styles.envelopeOverlayHitBox}>
        <div data-id="cardphoto" className={styles.hitSection}></div>
        <div data-id="cardtext" className={styles.hitSection}></div>
        <div data-id="envelope" className={styles.hitSection}></div>
        <div data-id="aroma" className={styles.hitSection}></div>
        <div data-id="date" className={styles.hitSection}></div>
      </div>
      <div className={styles.envelopeOverlayToolbarContainer}>
        <Toolbar section="cardPanelOverlay" />
      </div>
    </div>
  )
}
