import type { PostcardStatus } from '@entities/postcard'
import type { CardSection } from '@shared/config/constants'
import type {
  CardPieInnerData,
  CardPieSectionFlags,
} from '../../infrastructure/postcardCardPieViewModel'

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
  /**
   * Левый пирог: полная замена клика по сектору (mobile: закрыть CardPiePanel и открыть секцию).
   */
  onLeftPieSectorClick?: (section: CardSection) => void
  /** Левый пирог: клик по центральной иконке (например, вернуть левый режим). */
  onLeftPieCenterClick?: () => void
  /** Левый пирог: показать pointer на центральной иконке. */
  leftPieCenterClickable?: boolean
  /** Левый пирог: не рисовать центральный логотип (компактный превью). */
  hideLeftPieCenterLogo?: boolean
  /** Левый пирог: цветной круг в центре без логотипа (мини-паи). */
  leftPieCenterDisc?: boolean
  /** Цвет заливки центрального круга мини-пая (некомплект); по умолчанию — как у лого. */
  leftPieCenterDiscColor?: string
  /** Снимок секторов вместо Redux (мини-паи строк плана отправки). */
  pieInner?: CardPieInnerData
  pieSections?: CardPieSectionFlags
  /** Не рисовать иконки-плейсхолдеры в пустых секторах (мини-паи). */
  hideEmptySectorPlaceholders?: boolean
  /** Отключить клики и hover по секторам (мини-паи: один клик по всему пирогу). */
  sectorsInteractive?: boolean
  /** Правый пирог: центральная кнопка (напр. переход к календарю истории на месяц открытки). */
  onRightPieCenterClick?: () => void
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
