import React, { createContext, useContext } from 'react'
import type { PostcardStatus } from '@entities/postcard'
import type {
  CardPieInnerData,
  CardPieSectionFlags,
} from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import type { CardPieRightListSource } from '@features/cardPie/domain/types'

export type CardPieStationSide = 'left' | 'right'

export type CardPieSectionPeek =
  | 'cardphoto'
  | 'cardtext'
  | 'envelope'
  | 'aroma'
  | 'date'

export type RightListArchiveMiniContextValue = {
  activePieSide: CardPieStationSide
  /** Правый CardPie + cardPieEdit: редактируем левую открытку, превью справа не сбрасываем. */
  cardPieEditEngaged: boolean
  /** Полный factory-edit (все секции) — кнопка cardPieEdit на CardPie. */
  requestCardPieEdit: (() => void) | null
  /** Edit только текущей peek-секции (editLight в верхнем тулбаре) — без active cardPieEdit. */
  requestSectionEditFromPeek: (() => void) | null
  /**
   * Apply в archive-edit → упрощённый peek этой секции (без тулбара редактора).
   */
  exitArchiveEditToSectionPeek: ((section: CardPieSectionPeek) => void) | null
  centerStripListMirrorEnabled: boolean
  mirrorInner: CardPieInnerData | null
  mirrorSectionFlags: CardPieSectionFlags | null
  mirrorTargetLocalId: number | null
  mirrorListArchiveSource: CardPieRightListSource | null
  listRowInner: CardPieInnerData | null
  listRowLocalId: number | null
  /** Статус открытки выбранной строки правого списка (корзина / история). */
  listRowPostcardStatus: PostcardStatus | undefined
  rightPieCardphotoPeekNoToolbar: boolean
  clearRightPieCardphotoPeek: () => void
  rightPieCardtextPeekNoToolbar: boolean
  clearRightPieCardtextPeek: () => void
  rightPieEnvelopePeekNoToolbar: boolean
  clearRightPieEnvelopePeek: () => void
  rightPieAromaPeekNoToolbar: boolean
  clearRightPieAromaPeek: () => void
  rightPieDatePeekNoToolbar: boolean
  clearRightPieDatePeek: () => void
}

const defaultValue: RightListArchiveMiniContextValue = {
  activePieSide: 'left',
  cardPieEditEngaged: false,
  requestCardPieEdit: null,
  requestSectionEditFromPeek: null,
  exitArchiveEditToSectionPeek: null,
  centerStripListMirrorEnabled: false,
  mirrorInner: null,
  mirrorSectionFlags: null,
  mirrorTargetLocalId: null,
  mirrorListArchiveSource: null,
  listRowInner: null,
  listRowLocalId: null,
  listRowPostcardStatus: undefined,
  rightPieCardphotoPeekNoToolbar: false,
  clearRightPieCardphotoPeek: () => {},
  rightPieCardtextPeekNoToolbar: false,
  clearRightPieCardtextPeek: () => {},
  rightPieEnvelopePeekNoToolbar: false,
  clearRightPieEnvelopePeek: () => {},
  rightPieAromaPeekNoToolbar: false,
  clearRightPieAromaPeek: () => {},
  rightPieDatePeekNoToolbar: false,
  clearRightPieDatePeek: () => {},
}

const RightListArchiveMiniContext =
  createContext<RightListArchiveMiniContextValue>(defaultValue)

export const RightListArchiveMiniProvider = RightListArchiveMiniContext.Provider

export const useRightListArchiveMini = () =>
  useContext(RightListArchiveMiniContext)
