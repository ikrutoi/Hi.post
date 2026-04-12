import type { CardStatus } from '@entities/postcard'

export interface CardPieProps {
  isProcessed?: boolean
  status?: CardStatus
  id?: string
  fillContainer?: boolean
  station?: 'left' | 'right'
}
