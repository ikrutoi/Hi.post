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
   * (для peek cardphoto/cardtext в фабрике без полного зеркала центра).
   */
  listRowInner: CardPieInnerData | null
  /** `localId` строки корзины/истории для ключей превью peek (при активном левом пироге). */
  listRowLocalId: number | null
  /** Левый режим пирога: в фабрике показать только фото строки справа, без тулбара cardphoto. */
  rightPieCardphotoPeekNoToolbar: boolean
  /** Выход из peek cardphoto (полный редактор + тулбары), напр. при клике по мини-секции. */
  clearRightPieCardphotoPeek: () => void
  /** Левый режим пирога: только текст строки справа, без тулбара cardtext. */
  rightPieCardtextPeekNoToolbar: boolean
  clearRightPieCardtextPeek: () => void
  /** Левый режим пирога: конверт строки справа — без верхнего тулбара секции; футер без тумблеров. */
  rightPieEnvelopePeekNoToolbar: boolean
  clearRightPieEnvelopePeek: () => void
  rightPieAromaPeekNoToolbar: boolean
  clearRightPieAromaPeek: () => void
}

const defaultValue: RightListArchiveMiniContextValue = {
  centerStripListMirrorEnabled: false,
  mirrorInner: null,
  mirrorSectionFlags: null,
  mirrorTargetLocalId: null,
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
}

const RightListArchiveMiniContext =
  createContext<RightListArchiveMiniContextValue>(defaultValue)

export const RightListArchiveMiniProvider = RightListArchiveMiniContext.Provider

export const useRightListArchiveMini = () =>
  useContext(RightListArchiveMiniContext)
