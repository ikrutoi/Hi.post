import React from 'react'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import EnvelopeSvg from '@data/img/envelope-card-panel_02.svg?react'
import styles from './EnvelopeOverlay.module.scss'
import type { SizeCard } from '@layout/domain/types'

interface EnvelopeOverlayProps {
  sizeMiniCard: SizeCard
}

export const EnvelopeOverlay: React.FC<EnvelopeOverlayProps> = ({
  sizeMiniCard,
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
      <EnvelopeSvg
        className={styles.envelopeOverlaySvg}
        // width={`${sizeMiniCard.width}px`}
        // height={`${sizeMiniCard.height}px`}
      />
      {/* <div
        className={styles.envelopeOverlayPlug}
        style={{
          height: `${sizeMiniCard.height}px`,
          width: `${sizeMiniCard.width}px`,
        }}
      /> */}
      <Toolbar section="cardPanelOverlay" />
    </div>
  )
}
