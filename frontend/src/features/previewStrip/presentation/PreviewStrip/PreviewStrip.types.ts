import type { PreviewStripItem } from '../../domain/types'

export interface PreviewStripProps {
  items: PreviewStripItem[]
  containerHeight: number
  className?: string
  onDelete?: (item: PreviewStripItem) => void
  /** При клике на превью (например адрес) — подставить в форму. Только для envelope. */
  onSelectItem?: (item: PreviewStripItem) => void
}
