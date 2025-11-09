import type {
  CardphotoToolbarKey,
  CardphotoToolbarState,
  CardtextToolbarKey,
  CardtextToolbarState,
  EnvelopeToolbarKey,
  EnvelopeToolbarState,
  CardPanelToolbarKey,
  CardPanelToolbarState,
  CardPanelOverlayToolbarKey,
  CardPanelOverlayToolbarState,
} from '../types'

export const TOOLBAR_SECTIONS = [
  'cardphoto',
  'cardtext',
  'envelope',
  'cardPanel',
  'cardPanelOverlay',
] as const

export type ToolbarSection = (typeof TOOLBAR_SECTIONS)[number]

export type ToolbarState = {
  cardphoto: CardphotoToolbarState
  cardtext: CardtextToolbarState
  envelope: EnvelopeToolbarState
  cardPanel: CardPanelToolbarState
  cardPanelOverlay: CardPanelOverlayToolbarState
}

export type ToolbarKey =
  | CardphotoToolbarKey
  | CardtextToolbarKey
  | EnvelopeToolbarKey
  | CardPanelToolbarKey
  | CardPanelOverlayToolbarKey
