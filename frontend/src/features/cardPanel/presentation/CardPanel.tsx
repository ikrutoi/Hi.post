import React, { useRef, useState, useMemo } from 'react'
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
import { TemplateStripCard } from '../TemplateStrip/presentation/TemplateStripCard/TemplateStripCard'
import { getSortedSections } from '../application/helpers'
import {
  templateStripScrollIndexToScrollIndex,
} from '../application/helpers/templateStripScrollIndexToScrollIndex'
import { buildTemplateStripScrollIndex } from '../TemplateStrip/application/helpers/buildTemplateStripScrollIndex'
import { useAddressTemplates, useCardtextTemplates } from '@entities/templates/application/hooks'
import { CARD_PANEL_SECTIONS_PRIORITY } from '../domain/types'
import styles from './CardPanel.module.scss'
import type { ScrollIndex } from '../CardScroller/domain/types'
import type { TemplateStripItem } from '../TemplateStrip/domain/types'

export const CardPanel = () => {
  const cardsListRef = useRef<HTMLDivElement>(null)
  const [localValueScroll, setLocalValueScroll] = useState(0)

  const { editorState } = useCardEditorFacade()
  const { state: stateCardPanel, viewFlags, actions: cardPanelActions } =
    useCardPanelFacade()
  const { isPacked, activeTemplate, valueScroll } = stateCardPanel
  const isTemplateMode = viewFlags.isTemplateMode

  const { isPreviewOpen } = useCardFacade()

  const senderTemplates = useAddressTemplates('sender')
  const recipientTemplates = useAddressTemplates('recipient')
  const cardtextTemplates = useCardtextTemplates()

  const templateStripItems = useMemo((): TemplateStripItem[] => {
    if (!activeTemplate) return []
    if (activeTemplate === 'envelopeSender')
      return senderTemplates.templates.map((t) => ({
        section: 'sender' as const,
        template: t,
      }))
    if (activeTemplate === 'envelopeRecipient')
      return recipientTemplates.templates.map((t) => ({
        section: 'recipient' as const,
        template: t,
      }))
    if (activeTemplate === 'cardtext')
      return cardtextTemplates.templates.map((t) => ({
        section: 'cardtext' as const,
        template: t,
      }))
    return []
  }, [
    activeTemplate,
    senderTemplates.templates,
    recipientTemplates.templates,
    cardtextTemplates.templates,
  ])

  const scrollIndexForScroller: ScrollIndex | null = useMemo(() => {
    if (!isTemplateMode || templateStripItems.length === 0) return null
    const raw = buildTemplateStripScrollIndex(templateStripItems)
    return templateStripScrollIndexToScrollIndex(raw)
  }, [isTemplateMode, templateStripItems])

  const sliderValue = isTemplateMode ? valueScroll : localValueScroll
  const handleSliderChange = (value: number | string) => {
    if (isTemplateMode) cardPanelActions.setValueScroll(Number(value))
    else setLocalValueScroll(Number(value))
  }
  const { handleChangeFromSliderCardsList, handleLetterClick } =
    useSliderLetterHandlers()
  const onSliderChange = (value: number | string) => {
    handleSliderChange(value)
    handleChangeFromSliderCardsList(value)
  }
  const onLetterClick = (evt: React.MouseEvent<HTMLSpanElement>) => {
    if (isTemplateMode) {
      const idx = Number((evt.currentTarget as HTMLElement).dataset.index)
      if (!Number.isNaN(idx)) cardPanelActions.setValueScroll(idx)
    }
    handleLetterClick(evt)
  }

  const completedSections = CARD_SECTIONS.filter(
    (section) => editorState[section].isComplete,
  )
  const sortedSections = getSortedSections(completedSections)

  const { meta } = useLayoutFacade()
  const { remSize, sizeMiniCard, sizeToolbarContour } = useSizeFacade()
  const { deltaEnd, maxMiniCardsCount } = meta

  const panelContentWidth =
    sizeToolbarContour?.width != null ? sizeToolbarContour.width : undefined
  const previewSlotWidth = sizeMiniCard?.height ?? 0

  useScrollSync(cardsListRef, setLocalValueScroll)

  if (!remSize || !sizeMiniCard) return null

  const cardSize = { width: sizeMiniCard.width, height: sizeMiniCard.height }
  const templateStripTranslateX = -(sliderValue * (cardSize.width ?? 0))

  return (
    <div
      className={styles.cardPanel}
      ref={cardsListRef}
      style={{ height: `${sizeMiniCard.height}px` }}
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
            value={sliderValue}
            scrollIndex={scrollIndexForScroller}
            maxMiniCardsCount={maxMiniCardsCount}
            deltaEnd={deltaEnd}
            handleChangeFromSliderCardsList={onSliderChange}
            onLetterClick={onLetterClick}
          />

          {isTemplateMode ? (
            <div
              className={styles.cardPanelTemplates}
              style={{
                overflow: 'hidden',
                height: `${cardSize.height}px`,
                width: panelContentWidth != null ? `${panelContentWidth - (sizeMiniCard.height ?? 0)}px` : '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: 'max-content',
                  transform: `translateX(${templateStripTranslateX}px)`,
                  transition: 'transform 0.15s ease-out',
                }}
              >
                {templateStripItems.map((item, index) => (
                  <div
                    key={`${item.section}-${item.template.id ?? index}`}
                    style={{
                      position: 'relative',
                      width: `${cardSize.width}px`,
                      height: `${cardSize.height}px`,
                      flexShrink: 0,
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
          ) : (
            <div className={styles.cardPanelMiniCards}>
              {sortedSections.map((section, i) => {
                const key =
                  section as keyof typeof CARD_PANEL_SECTIONS_PRIORITY
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
          )}
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
