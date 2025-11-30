import type {
  CardphotoToolbarKey,
  CardphotoToolbarState,
  CardtextToolbarKey,
  CardtextToolbarState,
  EnvelopeToolbarKey,
  AddressState,
  CardPanelToolbarKey,
  CardPanelToolbarState,
  CardPanelOverlayToolbarKey,
  CardPanelOverlayToolbarState,
} from '../types'

export const TOOLBAR_SECTIONS = [
  'cardphoto',
  'cardtext',
  'sender',
  'recipient',
  'cardPanel',
  'cardPanelOverlay',
] as const

export type ToolbarSection = (typeof TOOLBAR_SECTIONS)[number]

export type ToolbarState = {
  cardphoto: CardphotoToolbarState
  cardtext: CardtextToolbarState
  sender: AddressState
  recipient: AddressState
  cardPanel: CardPanelToolbarState
  cardPanelOverlay: CardPanelOverlayToolbarState
}

export type ToolbarKey =
  | CardphotoToolbarKey
  | CardtextToolbarKey
  | EnvelopeToolbarKey
  | CardPanelToolbarKey
  | CardPanelOverlayToolbarKey
