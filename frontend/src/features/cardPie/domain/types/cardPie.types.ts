import type { CardStatus } from '@entities/postcard'

export interface CardPieProps {
  status: CardStatus
  id?: string
  /** Заполнить родительский контейнер по размеру (width/height 100%) */
  fillContainer?: boolean
}
