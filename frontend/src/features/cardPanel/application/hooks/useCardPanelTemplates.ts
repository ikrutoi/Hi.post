import { useMemo, useCallback } from 'react'
import { useCardPanelFacade } from '../facades'
import { useSliderLetterHandlers } from './useSliderLetterHandlers'
import { buildTemplateStripScrollIndex } from '../../TemplateStrip/application/helpers/buildTemplateStripScrollIndex'
import { templateStripScrollIndexToScrollIndex } from '../helpers/templateStripScrollIndexToScrollIndex'
import { useAddressTemplates, useCardtextTemplates } from '@entities/templates/application/hooks'
import type { CardPanelTemplate } from '../../domain/types'
import type { ScrollIndex } from '../../CardScroller/domain/types'
import type { TemplateStripItem } from '../../TemplateStrip/domain/types'

export function useCardPanelTemplates(activeTemplate: CardPanelTemplate | null) {
  const { state, actions } = useCardPanelFacade()
  const { valueScroll } = state
  const { setValueScroll } = actions

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
    if (templateStripItems.length === 0) return null
    const raw = buildTemplateStripScrollIndex(templateStripItems)
    return templateStripScrollIndexToScrollIndex(raw)
  }, [templateStripItems])

  const { handleChangeFromSliderCardsList, handleLetterClick } =
    useSliderLetterHandlers()

  const onSliderChange = useCallback(
    (value: number | string) => {
      setValueScroll(Number(value))
      handleChangeFromSliderCardsList(value)
    },
    [setValueScroll, handleChangeFromSliderCardsList],
  )

  const onLetterClick = useCallback(
    (evt: React.MouseEvent<HTMLSpanElement>) => {
      const idx = Number((evt.currentTarget as HTMLElement).dataset.index)
      if (!Number.isNaN(idx)) setValueScroll(idx)
      handleLetterClick(evt)
    },
    [setValueScroll, handleLetterClick],
  )

  return {
    templateStripItems,
    scrollIndexForScroller,
    sliderValue: valueScroll,
    onSliderChange,
    onLetterClick,
  }
}
