export interface CardLetter {
  id: string
  index: number
  letter: string
}

export interface InfoCardsList {
  length: number
  firstLetters: CardLetter[]
}
