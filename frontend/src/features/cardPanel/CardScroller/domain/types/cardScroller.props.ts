import type { ScrollIndex } from './cardScroller.types'

export interface CardScrollerProps {
  value: number
  /** Когда null — слайдер отображается как неактивная серая полоса. */
  scrollIndex: ScrollIndex | null
  maxMiniCardsCount: number | null
  deltaEnd: number | null
  handleChangeFromSliderCardsList: (index: number | string) => void
  onLetterClick: (evt: React.MouseEvent<HTMLSpanElement>) => void
}
