import type {
  TemplateStripSection,
  TemplateStripItem,
  TemplateStripScrollIndex,
  TemplateStripCardSize,
} from '../../domain/types'

export interface TemplateStripProps {
  section: TemplateStripSection
  items: TemplateStripItem[]
  scrollIndex: TemplateStripScrollIndex | null
  scrollValue: number
  cardSize: TemplateStripCardSize
  maxVisibleCount: number
  deltaEnd?: boolean | null
  onScrollChange: (index: number | string) => void
  onLetterClick: (evt: React.MouseEvent<HTMLSpanElement>) => void
  onSelectTemplate?: (item: TemplateStripItem) => void
  onDeleteTemplate?: (item: TemplateStripItem) => void
  stripWidth?: number
}
