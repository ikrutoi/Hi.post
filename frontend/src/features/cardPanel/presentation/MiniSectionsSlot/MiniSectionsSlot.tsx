import React, { forwardRef } from 'react'
import { useSizeFacade } from '@layout/application/facades'
import { useCardEditorFacade } from '@entities/cardEditor/application/facades'
import { useCardPanelFacade } from '../../application/facades'
import { CARD_PANEL_SECTIONS_PRIORITY } from '../../domain/types'
import type { CardPanelSection } from '../../domain/types'
import { MiniCard } from '../../MiniCard/presentation/MiniCard'
import styles from './MiniSectionsSlot.module.scss'

const PARTS_TOTAL = 6
const GAP_PARTS = 1

const SECTIONS_ORDER: CardPanelSection[] = [
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
]

export const MiniSectionsSlot = forwardRef<HTMLDivElement>(
  function MiniSectionsSlot(_, ref) {
    const { sizeCard } = useSizeFacade()
    const { editorState } = useCardEditorFacade()
    const { state: stateCardPanel } = useCardPanelFacade()
    const isPacked = stateCardPanel.isPacked

    const totalWidth =
      sizeCard?.width != null && sizeCard.width > 0 ? sizeCard.width : null
    const sectionSize = totalWidth != null ? totalWidth / PARTS_TOTAL : null
    const gapSize =
      totalWidth != null ? (totalWidth * GAP_PARTS) / PARTS_TOTAL / 6 : null
    const sizeMiniCard =
      sectionSize != null
        ? {
            width: sectionSize,
            height: sectionSize,
            aspectRatio: 1,
            orientation: 'landscape' as const,
          }
        : null

    return (
      <div
        ref={ref}
        className={styles.root}
        style={{
          width: totalWidth != null ? `${totalWidth}px` : undefined,
          minWidth: sizeCard?.width === 0 ? '8rem' : undefined,
        }}
      >
        {sectionSize != null && gapSize != null && sizeMiniCard != null && (
          <div
            className={styles.strip}
            style={{
              paddingLeft: `${gapSize}px`,
              paddingRight: `${gapSize}px`,
              gap: `${gapSize}px`,
            }}
          >
            {SECTIONS_ORDER.map((section, i) => {
              const { index } = CARD_PANEL_SECTIONS_PRIORITY[section]
              return (
                <div
                  key={section}
                  className={styles.cell}
                  style={{
                    width: `${sectionSize}px`,
                    height: `${sectionSize}px`,
                  }}
                >
                  <MiniCard
                    section={section}
                    sizeMiniCard={sizeMiniCard}
                    zIndex={index}
                    position={0}
                    isPacked={true}
                    isEmpty={!editorState[section]?.isComplete}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  },
)
