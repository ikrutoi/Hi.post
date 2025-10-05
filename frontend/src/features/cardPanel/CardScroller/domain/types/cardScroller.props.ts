import type { CardLetter } from './cardScroller.types'

export interface InfoCardsList {
  length: number
  firstLetters: CardLetter[]
}

export interface CardScrollerProps {
  value: number
  infoCardsList: InfoCardsList
  maxCardsList: number
  deltaEnd: boolean
  handleChangeFromSliderCardsList: (index: number | string) => void
  onLetterClick: (evt: React.MouseEvent<HTMLSpanElement>) => void
}
