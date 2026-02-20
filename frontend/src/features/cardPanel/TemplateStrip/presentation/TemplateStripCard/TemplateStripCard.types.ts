import type {
  TemplateStripCardSize,
  TemplateStripItem,
} from '../../domain/types'

export interface TemplateStripCardProps {
  item: TemplateStripItem
  size: TemplateStripCardSize
  index: number
  onSelect?: (item: TemplateStripItem) => void
  onDelete?: (item: TemplateStripItem) => void
  cardRef?: (el: HTMLDivElement | null) => void
  compact?: boolean
}
