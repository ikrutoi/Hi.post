import type { PostcardStatus } from '@entities/postcard'

/** Which list drives the right archive CardPie (cart strip vs history strip). */
export type CardPieRightListSource = 'cart' | 'history'

export interface CardPieProps {
  isProcessed?: boolean
  status?: PostcardStatus
  id?: string
  fillContainer?: boolean
  station?: 'left' | 'right'
  /** Set when `station="right"` and the pie reflects a list row selection. */
  rightListSource?: CardPieRightListSource | null
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
