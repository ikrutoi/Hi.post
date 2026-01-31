import { flattenIcons } from '../helpers'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const CARD_PANEL_OVERLAY_KEYS = [
  'addCart',
  'addDrafts',
  'delete',
] as const

export type CardPanelOverlayToolbarKey =
  (typeof CARD_PANEL_OVERLAY_KEYS)[number]

export interface CardPanelOverlayToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const CARD_PANEL_OVERLAY_TOOLBAR: ToolbarConfig = [
  {
    group: 'overlay',
    icons: [
      { key: 'addCart', state: 'disabled' },
      { key: 'addDrafts', state: 'disabled' },
      { key: 'delete', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

export const initialCardPanelOverlayToolbarState: CardPanelOverlayToolbarState =
  {
    ...Object.fromEntries(flattenIcons(CARD_PANEL_OVERLAY_TOOLBAR)),
    config: [...CARD_PANEL_OVERLAY_TOOLBAR],
  }

export interface CardPanelOverlaySectionConfig extends BaseSectionConfig<
  CardPanelOverlayToolbarState,
  CardPanelOverlayToolbarKey,
  'cardPanelOverlay'
> {}
