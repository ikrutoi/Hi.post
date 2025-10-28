import React, { useRef, useState } from 'react'
import { CARD_SECTIONS } from '@entities/card/domain/types'
import { useCardPanel } from '@cardPanel/application/hooks/cardPanel/useCardPanel'
import {
  useScrollSync,
  useExpendCard,
  useMinimizeIcons,
} from '@cardPanel/application/hooks'
import { useCardFacade } from '@entities/card/application/facades'
import { useLayoutFacade } from '@layout/application/facades'
import { useLayoutNavFacade } from '@layoutNav/application/facades'
import { useSliderLetterHandlers } from '@cardPanel/application/hooks/useSliderLetterHandlers'
import { MiniCard } from '../MiniCard/presentation/MiniCard'
import { SectionPresets } from '../SectionPresets/presentation/SectionPresets'
import { CardScroller } from '../CardScroller/presentation/CardScroller'
import { SectionPresetsRenderer } from './SectionPresetsRender'
import { EnvelopeOverlay } from './EnvelopeOverlay'
import type { ScrollIndex } from '../CardScroller/domain/types'
import styles from './CardPanel.module.scss'

export const CardPanel = () => {
  const cardsListRef = useRef<HTMLDivElement>(null)
  const [valueScroll, setValueScroll] = useState(0)
  const [scrollIndex, setScrollIndex] = useState<ScrollIndex | null>(null)

  const { completionMap } = useCardFacade()

  const {
    buttonsFullCard,
    memoryCardtext,
    fullCard,
    minimize,
    showIconsMinimize,
    buttonIconRefs,
    buttonArrowsRef,
    miniPolyCardsRef,
    handleClickMiniKebab,
    handleClickCardtext,
    handleClickIconArrows,
    handleIconFullCardClick,
  } = useCardPanel()

  const { size, section, meta, memory } = useLayoutFacade()
  const { sizeMiniCard } = size
  const { activeSection } = section
  const { deltaEnd, maxCardsList, choiceClip } = meta
  const { lockExpendMemoryCard, expendMemoryCard } = memory

  const { state } = useLayoutNavFacade()
  const { selectedTemplate } = state

  const { handleChangeFromSliderCardsList, handleLetterClick } =
    useSliderLetterHandlers()

  useScrollSync(cardsListRef, setValueScroll)

  useExpendCard({
    expendCard: expendMemoryCard,
    lockExpendCard: lockExpendMemoryCard,
    selectSection: activeSection,
    buttonArrowsRef,
  })

  useMinimizeIcons(minimize, showIconsMinimize, buttonsFullCard, buttonIconRefs)

  return (
    <div className={styles.cardPanel} ref={cardsListRef}>
      <div className={styles.toolbar}>
        <EnvelopeOverlay sizeMiniCard={sizeMiniCard} />
        <CardScroller
          value={valueScroll}
          scrollIndex={scrollIndex}
          maxCardsList={maxCardsList}
          deltaEnd={deltaEnd}
          handleChangeFromSliderCardsList={handleChangeFromSliderCardsList}
          onLetterClick={handleLetterClick}
        />
      </div>

      <div className={styles.sections} ref={miniPolyCardsRef}>
        {CARD_SECTIONS.map(
          (section) =>
            completionMap[section] && (
              <MiniCard key={section} section={section} />
            )
        )}

        {/* {activeSection === 'cardtext' && (
          <MiniCard
            section="cardtext"
            memoryCardtext={memoryCardtext.cardtext}
            onClickCard={handleClickCardtext}
            onClickKebab={handleClickMiniKebab}
          />
        )} */}
        {/* Другие секции: cardphoto, envelope, date, aroma — аналогично */}
      </div>

      <SectionPresetsRenderer
        // sizeMiniCard={sizeMiniCard}
        selectedTemplate={selectedTemplate}
        widthCardsList={cardsListRef.current?.clientWidth || 0}
        // setScrollIndex={setScrollIndex}
        valueScroll={valueScroll}
        setValueScroll={setValueScroll}
      />

      <div className={styles.actions}>
        {Object.entries(buttonsFullCard.fullCard).map(([key, isActive]) => (
          <button
            key={key}
            className={styles.fullcardBtn}
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
        <button
          className={styles.toggle}
          ref={buttonArrowsRef}
          onClick={handleClickIconArrows}
        >
          ⬌
        </button>
      </div>
    </div>
  )
}
