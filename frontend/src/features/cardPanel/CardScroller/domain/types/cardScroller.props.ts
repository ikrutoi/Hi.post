import type { ScrollIndex } from './cardScroller.types'

export interface CardScrollerProps {
  value: number
  scrollIndex: ScrollIndex | null
  maxMiniCardsCount: number | null
  deltaEnd: number | null
  handleChangeFromSliderCardsList: (index: number | string) => void
  onLetterClick: (evt: React.MouseEvent<HTMLSpanElement>) => void
}
