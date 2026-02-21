import type { CardPanelTemplate } from '../../domain/types'

export interface CardPanelTemplatesViewProps {
  activeTemplate: CardPanelTemplate | null
  sizeMiniCard: { width?: number; height?: number }
  panelContentWidth: number | undefined
  previewSlotWidth: number
  deltaEnd: number | null
  maxMiniCardsCount: number | null
}
