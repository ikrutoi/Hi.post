import { CardStatus } from '@entities/card/domain/types'

export interface CardPieProps {
  status: CardStatus
  id?: string
}
