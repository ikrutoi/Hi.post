import React from 'react'
import { CARD_SECTIONS } from '@shared/config/constants'
import { CardPie } from '../../cardPie/presentation/CardPie'
import { useCardEditorFacade } from '@entities/cardEditor/application/facades'
import { useCardFacade } from '@entities/card/application/facades'
import { useEnvelopeFacade } from '@envelope/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useCardPanelFacade } from '../application/facades'
import { MiniCard } from '../MiniCard/presentation/MiniCard'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { getSortedSections } from '../application/helpers'
import { CARD_PANEL_SECTIONS_PRIORITY } from '../domain/types'
import styles from './CardPanel.module.scss'

export const CardPanel = () => {
  const { editorState } = useCardEditorFacade()
  const { state: stateCardPanel } = useCardPanelFacade()
  const { isPacked } = stateCardPanel
  useEnvelopeFacade()
  const { isPreviewOpen } = useCardFacade()
  const { remSize, sizeCard, sizeMiniCard } = useSizeFacade()

  const completedSections = CARD_SECTIONS.filter(
    (section) => editorState[section].isComplete,
  )
  const sortedSections = getSortedSections(completedSections)

  const previewSlotWidth = sizeMiniCard?.height ?? 0
  const toolbarWidthPx = 2 * remSize
  // const blockWidth = sizeMiniCard.height + toolbarWidthPx + sizeCard.width
  const blockWidth = sizeMiniCard.height * 7

  if (!remSize || !sizeMiniCard || !sizeCard) return null

  return (
    <div className={styles.cardPanel}>
      <div
        className={styles.cardPanelBlock}
        style={{
          width: `${blockWidth}px`,
          height: `${sizeMiniCard.height}px`,
        }}
      >
        <div
          className={styles.cardPanelPie}
          style={{
            height: `${sizeMiniCard.height}px`,
            width: `${sizeMiniCard.height}px`,
          }}
        >
          <CardPie isProcessed />
        </div>
        <div
          className={styles.cardPanelPieToolbar}
          style={{
            width: `${toolbarWidthPx}px`,
            height: `${sizeMiniCard.height}px`,
          }}
        >
          <Toolbar section="editorPie" />
        </div>
        <div
          className={styles.cardPanelContent}
          style={{
            width: `${sizeCard.width}px`,
            height: `${sizeMiniCard.height}px`,
          }}
        >
          <div className={styles.cardPanelMiniCards}>
            {sortedSections.map((section, i) => {
              const key = section as keyof typeof CARD_PANEL_SECTIONS_PRIORITY
              const { index } = CARD_PANEL_SECTIONS_PRIORITY[key]
              return (
                <MiniCard
                  key={section}
                  section={section}
                  sizeMiniCard={sizeMiniCard}
                  zIndex={index}
                  position={i}
                  isPacked={isPacked}
                />
              )
            })}
          </div>
        </div>
      </div>
      {isPreviewOpen && (
        <div
          className={styles.cardPanelPreviewSlot}
          style={{
            width: `${previewSlotWidth}px`,
            height: `${sizeMiniCard.height}px`,
          }}
        >
          <CardPie status="cart" />
        </div>
      )}
    </div>
  )
}
