import React from 'react'
import { CardScroller } from '../../CardScroller/presentation/CardScroller'
import { TemplateStripCard } from '../../TemplateStrip/presentation/TemplateStripCard/TemplateStripCard'
import { useCardPanelTemplates } from '../../application/hooks/useCardPanelTemplates'
import styles from './CardPanelTemplatesView.module.scss'
import type { CardPanelTemplatesViewProps } from './CardPanelTemplatesView.types'

export const CardPanelTemplatesView: React.FC<CardPanelTemplatesViewProps> = ({
  activeTemplate,
  sizeMiniCard,
  panelContentWidth,
  previewSlotWidth,
  deltaEnd,
  maxMiniCardsCount,
}) => {
  const {
    templateStripItems,
    scrollIndexForScroller,
    sliderValue,
    onSliderChange,
    onLetterClick,
  } = useCardPanelTemplates(activeTemplate)

  const cardSize = {
    width: sizeMiniCard.width ?? 0,
    height: sizeMiniCard.height ?? 0,
  }
  const templateStripTranslateX = -(sliderValue * cardSize.width)
  const stripAreaWidth =
    panelContentWidth != null
      ? panelContentWidth + previewSlotWidth
      : undefined

  return (
    <div
      className={styles.root}
      style={{
        width: stripAreaWidth != null ? `${stripAreaWidth}px` : '100%',
        height: `${cardSize.height}px`,
      }}
    >
      <div
        className={styles.main}
        style={{
          width: stripAreaWidth != null ? `${stripAreaWidth}px` : '100%',
          height: `${cardSize.height}px`,
        }}
      >
        <div
          className={styles.strip}
          style={{
            height: `${cardSize.height}px`,
            width: stripAreaWidth != null ? `${stripAreaWidth}px` : '100%',
          }}
        >
          <div
            className={styles.stripRow}
            style={{ transform: `translateX(${templateStripTranslateX}px)` }}
          >
            {templateStripItems.map((item, index) => (
              <div
                key={`${item.section}-${item.template.id ?? index}`}
                className={styles.cardSlot}
                style={{
                  width: `${cardSize.width}px`,
                  height: `${cardSize.height}px`,
                }}
              >
              <TemplateStripCard
                item={item}
                size={cardSize}
                index={index}
                onSelect={() => {}}
                compact
              />
              </div>
            ))}
          </div>
        </div>
        <CardScroller
        value={sliderValue}
        scrollIndex={scrollIndexForScroller}
        maxMiniCardsCount={maxMiniCardsCount}
        deltaEnd={deltaEnd}
        handleChangeFromSliderCardsList={onSliderChange}
        onLetterClick={onLetterClick}
        />
      </div>
    </div>
  )
}
