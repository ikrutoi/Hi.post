import type { PostcardStatus } from '@entities/postcard'
import type { CardSection } from '@shared/config/constants'

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
  /**
   * Правый пирог по строке списка: заменить `setActiveSection` при клике по сектору
   * (например, peek cardphoto в фабрике при активном левом пироге).
   */
  onListArchiveSectorClick?: (section: CardSection) => void
  /** Левый пирог: вызвать перед сменой секции (сброс peek cardphoto со строки справа). */
  onBeforeLeftPieSectorClick?: () => void
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
