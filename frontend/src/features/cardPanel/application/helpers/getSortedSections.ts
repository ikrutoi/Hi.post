import { CARD_PANEL_SECTIONS_PRIORITY } from '../../domain/types'
import type { CardPanelSection } from '../../domain/types'

export const getSortedSections = (
  sections: readonly CardPanelSection[]
): CardPanelSection[] => {
  return [...sections].sort(
    (a, b) =>
      CARD_PANEL_SECTIONS_PRIORITY[a].position -
      CARD_PANEL_SECTIONS_PRIORITY[b].position
  )
}
