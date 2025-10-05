import React, { useRef, useState } from 'react'

import { useCardPanel } from '@features/cardPanel/application/hooks/cardPanel/useCardPanel'
import { useScrollSync } from '@cardPanel/application/hooks'
import { useExpendCard } from '@cardPanel/application/hooks/useExpendCard'
import { useMinimizeIcons } from '@cardPanel/application/hooks/useMinimizeIcons'
import { useLayoutFacade } from '@layout/application/facades'
// import { useCardPanelHandlers } from '@features/cardPanel/application/hooks/useSliderLetterHandlers'
import { useSliderLetterHandlers } from '@cardPanel/application/hooks/useSliderLetterHandlers'
import { MiniCard } from '../MiniCard/presentation/MiniCard'
import { SectionPresets } from '../SectionPresets/presentation/SectionPresets'
import { CardScroller } from '../CardScroller/presentation/CardScroller'
import { SectionPresetsRenderer } from './SectionPresetsRender'
import { EnvelopeOverlay } from './EnvelopeOverlay'

import styles from './CardPanel.module.scss'

export const CardPanel = () => {
  const cardsListRef = useRef<HTMLDivElement>(null)
  const [valueScroll, setValueScroll] = useState(0)
  const [infoCardsList, setInfoCardsList] = useState<number | null>(null)

  const {
    btnsFullCard,
    memoryCardtext,
    fullCard,
    minimize,
    showIconsMinimize,
    btnIconRefs,
    btnArrowsRef,
    miniPolyCardsRef,
    handleClickMiniKebab,
    handleClickCardtext,
    handleClickIconArrows,
    handleIconFullCardClick,
  } = useCardPanel()

  // const { getInfoCardsList } = useLayoutControllers()

  const {
    layout: {
      deltaEnd,
      activeSection,
      expendMemoryCard,
      lockExpendMemoryCard,
      maxCardsList,
      sizeMiniCard,
      choiceClip,
    },
  } = useLayoutFacade()

  const { handleChangeFromSliderCardsList, handleLetterClick } =
    useSliderLetterHandlers()

  useScrollSync(cardsListRef, setValueScroll)

  useExpendCard({
    expendCard: expendMemoryCard,
    lockExpendCard: lockExpendMemoryCard,
    activeSections: activeSection,
    btnArrowsRef,
  })

  useMinimizeIcons(minimize, showIconsMinimize, btnsFullCard, btnIconRefs)

  return (
    <div className={styles.cardPanel} ref={cardsListRef}>
      <div className={styles.toolbar}>
        <EnvelopeOverlay sizeMiniCard={sizeMiniCard} />
        <CardScroller
          value={valueScroll}
          // infoCardsList={getInfoCardsList()}
          maxCardsList={maxCardsList}
          deltaEnd={deltaEnd}
          handleChangeFromSliderCardsList={handleChangeFromSliderCardsList}
          onLetterClick={handleLetterClick}
        />
      </div>

      <div className={styles.sections} ref={miniPolyCardsRef}>
        {activeSection.cardtext && (
          <MiniCard
            section="cardtext"
            memoryCardtext={memoryCardtext.cardtext}
            onClickCard={handleClickCardtext}
            onClickKebab={handleClickMiniKebab}
          />
        )}
        {/* Другие секции: cardphoto, envelope, date, aroma — аналогично */}
      </div>

      <SectionPresetsRenderer
        choiceClip={choiceClip}
        sizeMiniCard={sizeMiniCard}
        widthCardsList={cardsListRef.current?.clientWidth || 0}
        valueScroll={valueScroll}
        setValueScroll={setValueScroll}
        setInfoCardsList={setInfoCardsList}
      />

      <div className={styles.actions}>
        {Object.entries(btnsFullCard.fullCard).map(([key, isActive]) => (
          <button
            key={key}
            className={styles.fullcardBtn}
            data-tooltip={key}
            ref={(el) => {
              btnIconRefs.current[key] = el
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
          ref={btnArrowsRef}
          onClick={handleClickIconArrows}
        >
          ⬌
        </button>
      </div>
    </div>
  )
}
