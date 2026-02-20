import type { TemplateStripScrollIndex } from '../../domain/types'

export interface TemplateSliderProps {
  value: number
  scrollIndex: TemplateStripScrollIndex | null
  maxVisibleCount: number
  deltaEnd: boolean | null
  onChange: (index: number | string) => void
  onLetterClick: (evt: React.MouseEvent<HTMLSpanElement>) => void
}
