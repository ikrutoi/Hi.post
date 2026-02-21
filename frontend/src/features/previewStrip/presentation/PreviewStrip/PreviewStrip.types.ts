import type { PreviewStripItem } from '../../domain/types'

export interface PreviewStripProps {
  items: PreviewStripItem[]
  containerHeight: number
  className?: string
}
