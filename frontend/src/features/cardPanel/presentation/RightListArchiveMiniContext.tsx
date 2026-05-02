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
  /**
   * Снимок строки списка справа, пока выбрана строка — даже при активном левом пироге
   * (для peek cardphoto в фабрике без полного зеркала центра).
   */
  listRowInner: CardPieInnerData | null
  /** Левый режим пирога: в фабрике показать только фото строки справа, без тулбара cardphoto. */
  rightPieCardphotoPeekNoToolbar: boolean
  /** Выход из peek cardphoto (полный редактор + тулбары), напр. при клике по мини-секции. */
  clearRightPieCardphotoPeek: () => void
}

const defaultValue: RightListArchiveMiniContextValue = {
  centerStripListMirrorEnabled: false,
  mirrorInner: null,
  mirrorSectionFlags: null,
  mirrorTargetLocalId: null,
  listRowInner: null,
  rightPieCardphotoPeekNoToolbar: false,
  clearRightPieCardphotoPeek: () => {},
}

const RightListArchiveMiniContext =
  createContext<RightListArchiveMiniContextValue>(defaultValue)

export const RightListArchiveMiniProvider = RightListArchiveMiniContext.Provider

export const useRightListArchiveMini = () =>
  useContext(RightListArchiveMiniContext)
