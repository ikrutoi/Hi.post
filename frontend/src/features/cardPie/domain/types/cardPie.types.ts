import type { CardStatus } from '@entities/postcard'

export interface CardPieProps {
  /** Режим активной сессии редактора (данные из редактора). */
  isProcessed?: boolean
  status?: CardStatus
  id?: string
  /** Заполнить родительский контейнер по размеру (width/height 100%) */
  fillContainer?: boolean
}
