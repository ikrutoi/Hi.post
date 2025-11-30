import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { CARD_SECTIONS } from '@entities/card/domain/types'
import { useCardPanelController } from '@cardPanel/application/hooks/cardPanel'
import {
  useScrollSync,
  useExpendCard,
  useMinimizeIcons,
} from '@cardPanel/application/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { useCardEditorFacade } from '@entities/card/application/facades'
import { useLayoutFacade } from '@layout/application/facades'
import { useLayoutNavFacade } from '@layoutNav/application/facades'
import { useCardPanelFacade } from '../application/facades'
import { useSliderLetterHandlers } from '@cardPanel/application/hooks/useSliderLetterHandlers'
import { MiniCard } from '../MiniCard/presentation/MiniCard'
import { SectionPresets } from '../SectionPresets/presentation/SectionPresets'
import { CardScroller } from '../CardScroller/presentation/CardScroller'
import { SectionPresetsRenderer } from './SectionPresetsRender'
import { EnvelopeOverlay } from './EnvelopeOverlay'
import { getSortedSections } from '../application/helpers'
import { CARD_PANEL_SECTIONS_PRIORITY } from '../domain/types'
import styles from './CardPanel.module.scss'
import type { ScrollIndex } from '../CardScroller/domain/types'
import type { SizeCard } from '@layout/domain/types'

type CardPanelProps = {
  sizeMiniCard: SizeCard
}

export const CardPanel: React.FC<CardPanelProps> = ({ sizeMiniCard }) => {
  const cardsListRef = useRef<HTMLDivElement>(null)
  const [valueScroll, setValueScroll] = useState(0)
  const [scrollIndex, setScrollIndex] = useState<ScrollIndex | null>(null)

  const { state: stateCardEditor, computed: computedCardEditor } =
    useCardEditorFacade()
  const { editor } = stateCardEditor
  const { isDraftReady, isFullReady } = computedCardEditor

  const { state: stateCardPanel } = useCardPanelFacade()
  const { isPacked } = stateCardPanel

  const completedSections = CARD_SECTIONS.filter(
    (section) => editor[section].isComplete
  )

  const sortedSections = getSortedSections(completedSections)

  const miniPolyCardsRef = useRef<HTMLDivElement>(null)

  const isTemplateMode = false

  // const {
  //   buttonsFullCard,
  //   memoryCardtext,
  //   fullCard,
  //   minimize,
  //   showIconsMinimize,
  //   buttonIconRefs,
  //   buttonArrowsRef,
  //   miniPolyCardsRef,
  //   handleClickMiniKebab,
  //   handleClickCardtext,
  //   handleClickIconArrows,
  //   handleIconFullCardClick,
  // } = useCardPanelController()

  const { size, section, meta, memory } = useLayoutFacade()
  const { remSize } = size
  const { activeSection } = section
  const { deltaEnd, maxMiniCardsCount, choiceClip } = meta
  const { lockExpendMemoryCard, expendMemoryCard } = memory

  if (!remSize) return

  const { state: stateLayoutNav } = useLayoutNavFacade()
  const { selectedTemplate } = stateLayoutNav

  const { handleChangeFromSliderCardsList, handleLetterClick } =
    useSliderLetterHandlers()

  useScrollSync(cardsListRef, setValueScroll)

  // useExpendCard({
  //   expendCard: expendMemoryCard,
  //   lockExpendCard: lockExpendMemoryCard,
  //   selectSection: activeSection,
  //   buttonArrowsRef,
  // })

  // useMinimizeIcons(minimize, showIconsMinimize, buttonsFullCard, buttonIconRefs)

  return (
    <div className={styles.cardPanel} ref={cardsListRef}>
      <div>
        {sizeMiniCard && (
          <EnvelopeOverlay
            sizeMiniCard={sizeMiniCard}
            completedSections={completedSections}
          />
        )}
        <CardScroller
          value={valueScroll}
          scrollIndex={scrollIndex}
          maxMiniCardsCount={maxMiniCardsCount}
          deltaEnd={deltaEnd}
          handleChangeFromSliderCardsList={handleChangeFromSliderCardsList}
          onLetterClick={handleLetterClick}
        />
      </div>

      <SectionPresetsRenderer
        selectedTemplate={selectedTemplate}
        widthCardsList={cardsListRef.current?.clientWidth || 0}
        valueScroll={valueScroll}
        setValueScroll={setValueScroll}
      />

      {isTemplateMode ? (
        <div className={styles.cardPanelTemplates}>
          {/* {templateList.map((template) => (
            <MiniTemplateCard
              key={template.id}
              template={template}
              sizeMiniCard={sizeMiniCard}
              onClick={() => applyTemplate(template)}
            />
          ))} */}
        </div>
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

      {/* <div className={styles.actions}>
        {Object.entries(buttonsFullCard.fullCard).map(([key, isActive]) => (
          <button
            key={key}
            className={clsx(styles.fullcardBtn, {
              [styles['fullcardBtn--active']]: isActive,
            })}
            data-tooltip={key}
            ref={(el) => {
              buttonIconRefs.current[key] = el
            }}
            onClick={() =>
              handleIconFullCardClick(key as 'save' | 'addCart' | 'remove')
            }
            disabled={!isActive}
          >
            {key}
          </button>
        ))}
      </div> */}
    </div>
  )
}
