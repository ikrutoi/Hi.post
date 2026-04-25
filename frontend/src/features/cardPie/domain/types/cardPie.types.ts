import type { PostcardStatus } from '@entities/postcard'

export interface CardPieProps {
  isProcessed?: boolean
  status?: PostcardStatus
  id?: string
  fillContainer?: boolean
  station?: 'left' | 'right'
}
