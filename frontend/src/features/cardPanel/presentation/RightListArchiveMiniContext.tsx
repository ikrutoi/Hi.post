import React, { createContext, useContext } from 'react'
import type { PostcardStatus } from '@entities/postcard'
import type {
  CardPieInnerData,
  CardPieSectionFlags,
} from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import type { CardPieRightListSource } from '@features/cardPie/domain/types'
import type { CardPieDualModeSnapshot } from '@cardPanel/domain/types/cardPieDualMode.types'
import { resolveCardPieDualMode } from '@cardPanel/application/helpers/resolveCardPieDualMode'

export type CardPieStationSide = 'left' | 'right'

export type CardPieSectionPeek =
  | 'cardphoto'
  | 'cardtext'
  | 'envelope'
  | 'aroma'
  | 'date'

export type RightListArchiveMiniContextValue = {
  activePieSide: CardPieStationSide
  /**
   * Dual-mode ownership for the active CardPie face.
   * `dataBranch: 'archive'` must not write assembly session (legacy edit still does —
   * see CARD_PIE_DUAL_MODE_WRITE_PATHS).
   */
  dualMode: CardPieDualModeSnapshot
  /**
   * Archive factory-edit engaged (editLight / postcardEdit).
   * Legacy: hydrates shared assembly session while keeping activePieSide === 'right'.
   * Target: edit archive sandbox only.
   */
  cardPieEditEngaged: boolean
  /**
   * `all` — editLight (полный factory-edit); `section` — postcardEdit только peek-секции.
   * Archive CardPie zeros the edited section from session isComplete while engaged.
   */
  cardPieEditHydrateScope: 'all' | 'section'
  /** Полный factory-edit (все секции) — кнопка editLight на CardPie. */
  requestCardPieEdit: (() => void) | null
  /** Edit только текущей peek-секции (postcardEdit в верхнем тулбаре). */
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

const defaultDualMode = resolveCardPieDualMode({
  activePieSide: 'left',
  archiveLocalId: null,
  archiveSource: null,
  archiveStatus: undefined,
  archiveEditEngaged: false,
})

const defaultValue: RightListArchiveMiniContextValue = {
  activePieSide: 'left',
  dualMode: defaultDualMode,
  cardPieEditEngaged: false,
  cardPieEditHydrateScope: 'all',
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
