import React, { createContext, useContext } from 'react'
import type {
  CardPieInnerData,
  CardPieSectionFlags,
} from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import type { CardPieRightListSource } from '@features/cardPie/domain/types'

export type CardPieStationSide = 'left' | 'right'

export type RightListArchiveMiniContextValue = {
  activePieSide: CardPieStationSide
  centerStripListMirrorEnabled: boolean
  mirrorInner: CardPieInnerData | null
  mirrorSectionFlags: CardPieSectionFlags | null
  mirrorTargetLocalId: number | null
  mirrorListArchiveSource: CardPieRightListSource | null
  listRowInner: CardPieInnerData | null
  listRowLocalId: number | null
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
  centerStripListMirrorEnabled: false,
  mirrorInner: null,
  mirrorSectionFlags: null,
  mirrorTargetLocalId: null,
  mirrorListArchiveSource: null,
  listRowInner: null,
  listRowLocalId: null,
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
