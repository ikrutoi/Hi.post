import React, { useRef, useState } from 'react'
import { CARD_SECTIONS } from '@shared/config/constants'
import { useScrollSync } from '@cardPanel/application/hooks'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { CardPie } from '../../cardPie/presentation/CardPie'
import { useCardEditorFacade } from '@entities/cardEditor/application/facades'
import { useCardFacade } from '@entities/card/application/facades'
import { useLayoutFacade } from '@layout/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useCardPanelFacade } from '../application/facades'
import { useSliderLetterHandlers } from '@cardPanel/application/hooks/useSliderLetterHandlers'
import { MiniCard } from '../MiniCard/presentation/MiniCard'
import { CardScroller } from '../CardScroller/presentation/CardScroller'
import { getSortedSections } from '../application/helpers'
import { CARD_PANEL_SECTIONS_PRIORITY } from '../domain/types'
import styles from './CardPanel.module.scss'

export const CardPanel = () => {
  const cardsListRef = useRef<HTMLDivElement>(null)
  const [localValueScroll, setLocalValueScroll] = useState(0)

  const { editorState } = useCardEditorFacade()
  const { state: stateCardPanel } = useCardPanelFacade()
  const { isPacked } = stateCardPanel

  const { isPreviewOpen } = useCardFacade()
  const { meta } = useLayoutFacade()
  const { remSize, sizeMiniCard, sizeToolbarContour } = useSizeFacade()
  const { deltaEnd, maxMiniCardsCount } = meta

  const { handleChangeFromSliderCardsList, handleLetterClick } =
    useSliderLetterHandlers()

  const completedSections = CARD_SECTIONS.filter(
    (section) => editorState[section].isComplete,
  )
  const sortedSections = getSortedSections(completedSections)

  const panelContentWidth =
    sizeToolbarContour?.width != null ? sizeToolbarContour.width : undefined
  const previewSlotWidth = sizeMiniCard?.height ?? 0

  useScrollSync(cardsListRef, setLocalValueScroll)

  if (!remSize || !sizeMiniCard) return null

  return (
    <div
      className={styles.cardPanel}
      ref={cardsListRef}
      // style={{ height: `${sizeMiniCard.height}px` }}
    >
      <div
        className={styles.cardPanelContent}
        style={{
          width:
            panelContentWidth != null
              ? `${panelContentWidth + previewSlotWidth}px`
              : '100%',
          height: `${sizeMiniCard.height}px`,
        }}
      >
        <div
          className={styles.cardPanelMain}
          style={{
            width:
              panelContentWidth != null
                ? `${panelContentWidth}px`
                : `calc(100% - ${previewSlotWidth}px)`,
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
            <CardPie status="processed" />
            <div className={styles.pieToolbar}>
              <Toolbar section="editorPie" />
            </div>
          </div>
          <CardScroller
            value={localValueScroll}
            scrollIndex={null}
            maxMiniCardsCount={maxMiniCardsCount}
            deltaEnd={deltaEnd}
            handleChangeFromSliderCardsList={handleChangeFromSliderCardsList}
            onLetterClick={handleLetterClick}
          />
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
        <div
          className={styles.cardPanelPreviewSlot}
          style={{
            width: `${previewSlotWidth}px`,
            height: `${sizeMiniCard.height}px`,
          }}
        >
          {isPreviewOpen && <CardPie status="cart" />}
        </div>
      </div>
    </div>
  )
}
