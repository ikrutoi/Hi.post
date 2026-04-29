import React, { createContext, useContext } from 'react'
import type {
  CardPieInnerData,
  CardPieSectionFlags,
} from '@features/cardPie/infrastructure/postcardCardPieViewModel'

/** Drives center-strip minis to mirror the right CardPie list row (cart/history). */
export type RightListArchiveMiniContextValue = {
  /** True only in right pie side mode while the center strip is wrapped in the provider. */
  centerStripListMirrorEnabled: boolean
  mirrorInner: CardPieInnerData | null
  mirrorSectionFlags: CardPieSectionFlags | null
  /** `localId` выбранной строки корзины/истории, когда активен правый пирог. */
  mirrorTargetLocalId: number | null
}

const defaultValue: RightListArchiveMiniContextValue = {
  centerStripListMirrorEnabled: false,
  mirrorInner: null,
  mirrorSectionFlags: null,
  mirrorTargetLocalId: null,
}

const RightListArchiveMiniContext =
  createContext<RightListArchiveMiniContextValue>(defaultValue)

export const RightListArchiveMiniProvider = RightListArchiveMiniContext.Provider

export const useRightListArchiveMini = () =>
  useContext(RightListArchiveMiniContext)
