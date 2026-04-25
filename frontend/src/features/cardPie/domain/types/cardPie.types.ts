import type { PostcardStatus } from '@entities/postcard'

export interface CardPieProps {
  isProcessed?: boolean
  status?: PostcardStatus
  id?: string
  fillContainer?: boolean
  station?: 'left' | 'right'
}

export interface CardPieRefs {
  cardphoto: string
  cardtext: string
  sender: string
  recipient: string
  aroma: string
}

export interface CardPieFavoriteTemplate {
  id: string
  localId: number
  refs: CardPieRefs
}
