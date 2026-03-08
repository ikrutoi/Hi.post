import { CardStatus } from '@entities/card/domain/types'

export interface CardPieProps {
  status: CardStatus
  id?: string
  /** Заполнить родительский контейнер по размеру (width/height 100%) */
  fillContainer?: boolean
}
