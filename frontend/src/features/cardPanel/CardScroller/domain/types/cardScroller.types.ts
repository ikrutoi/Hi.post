export interface CardLetter {
  id: string
  index: number
  letter: string
}

export interface ScrollIndex {
  totalCount: number
  firstLetters: CardLetter[]
}
