import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { CARD_SECTIONS } from '@shared/config/constants'
import { useScrollSync } from '@cardPanel/application/hooks'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { CardPie } from '../../cardPie/presentation/CardPie'
import { useCardEditorFacade } from '@entities/cardEditor/application/facades'
import { useCardFacade } from '@entities/card/application/facades'
import { useLayoutFacade } from '@layout/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useLayoutNavFacade } from '@layoutNav/application/facades'
import { useCardPanelFacade } from '../application/facades'
import { useSliderLetterHandlers } from '@cardPanel/application/hooks/useSliderLetterHandlers'
import { MiniCard } from '../MiniCard/presentation/MiniCard'
import { CardScroller } from '../CardScroller/presentation/CardScroller'
import { SectionPresetsRenderer } from './SectionPresetsRender'
import { EnvelopeOverlay } from './EnvelopeOverlay'
import { getSortedSections } from '../application/helpers'
import { CARD_PANEL_SECTIONS_PRIORITY } from '../domain/types'
import styles from './CardPanel.module.scss'
import type { ScrollIndex } from '../CardScroller/domain/types'
import type { SizeCard } from '@layout/domain/types'

export const CardPanel = () => {
  const cardsListRef = useRef<HTMLDivElement>(null)
  const [valueScroll, setValueScroll] = useState(0)
  const [scrollIndex, setScrollIndex] = useState<ScrollIndex | null>(null)

  const { state: stateCardEditor } = useCardEditorFacade()
  const { editorState } = stateCardEditor

  const { state: stateCardPanel } = useCardPanelFacade()
  const { isPacked } = stateCardPanel

  const { isPreviewOpen } = useCardFacade()

  const completedSections = CARD_SECTIONS.filter(
    (section) => editorState[section].isComplete,
  )
  const sortedSections = getSortedSections(completedSections)

  const miniPolyCardsRef = useRef<HTMLDivElement>(null)
  const isTemplateMode = false

  const { section, meta, memory } = useLayoutFacade()
  const { remSize, sizeMiniCard } = useSizeFacade()
  const { deltaEnd, maxMiniCardsCount, choiceClip } = meta

  const { state: stateLayoutNav } = useLayoutNavFacade()
  const { selectedTemplate } = stateLayoutNav

  const { handleChangeFromSliderCardsList, handleLetterClick } =
    useSliderLetterHandlers()

  useScrollSync(cardsListRef, setValueScroll)

  if (!remSize || !sizeMiniCard) return

  return (
    <div
      className={styles.cardPanel}
      ref={cardsListRef}
      style={{ height: `${sizeMiniCard.height}px` }}
    >
      <div
        className={styles.cardPanelPie}
        style={{
          height: `${sizeMiniCard.height}px`,
          width: `${sizeMiniCard.height}px`,
        }}
      >
        <CardPie status="processed" />
        {/* <EnvelopeOverlay
          sizeMiniCard={sizeMiniCard}
          completedSections={completedSections}
        /> */}
        <div className={styles.pieToolbar}>
          <Toolbar section="cardPanelOverlay" />
        </div>
      </div>
      <CardScroller
        value={valueScroll}
        scrollIndex={scrollIndex}
        maxMiniCardsCount={maxMiniCardsCount}
        deltaEnd={deltaEnd}
        handleChangeFromSliderCardsList={handleChangeFromSliderCardsList}
        onLetterClick={handleLetterClick}
      />

      {/* <SectionPresetsRenderer
        selectedTemplate={selectedTemplate}
        widthCardsList={cardsListRef.current?.clientWidth || 0}
        valueScroll={valueScroll}
        setValueScroll={setValueScroll}
      /> */}

      {isTemplateMode ? (
        <div className={styles.cardPanelTemplates}></div>
      ) : (
        <div className={styles.cardPanelMiniCards}>
          {sortedSections.map((section, i) => {
            const key = section as keyof typeof CARD_PANEL_SECTIONS_PRIORITY
            const { index, position } = CARD_PANEL_SECTIONS_PRIORITY[key]

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
      )}
      {isPreviewOpen && <CardPie status="cart" />}
    </div>
  )
}
