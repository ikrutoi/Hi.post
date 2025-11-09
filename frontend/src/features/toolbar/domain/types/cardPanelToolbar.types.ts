import type { IconKey, IconState } from '@shared/config/constants'

export const CARD_PANEL_OVERLAY_KEYS = [
  'addCart',
  'save',
  'remove',
] as const satisfies readonly IconKey[]

export type CardPanelOverlayToolbarKey =
  (typeof CARD_PANEL_OVERLAY_KEYS)[number]

export type CardPanelOverlayToolbarState = Record<
  CardPanelOverlayToolbarKey,
  IconState
>

export const initialCardPanelOverlayToolbarState: CardPanelOverlayToolbarState =
  {
    addCart: 'enabled',
    save: 'enabled',
    remove: 'enabled',
  }

export const CARD_PANEL_KEYS = [
  'addCart',
  'addDrafts',
  'delete',
] as const satisfies readonly IconKey[]

export type CardPanelToolbarKey = (typeof CARD_PANEL_KEYS)[number]

export type CardPanelToolbarState = Record<CardPanelToolbarKey, IconState>

export const initialCardPanelToolbarState: CardPanelToolbarState = {
  addCart: 'enabled',
  addDrafts: 'enabled',
  delete: 'enabled',
}
