import { flattenIcons } from '../helpers'
import type { IconState } from '@shared/config/constants'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const CARD_PANEL_OVERLAY_KEYS = [
  'addCart',
  'addDrafts',
  'remove',
] as const
export type CardPanelOverlayToolbarKey =
  (typeof CARD_PANEL_OVERLAY_KEYS)[number]
export type CardPanelOverlayToolbarState = Record<
  CardPanelOverlayToolbarKey,
  IconState
>

export const CARD_PANEL_OVERLAY_TOOLBAR: ToolbarConfig = [
  {
    group: 'overlay',
    icons: [
      { key: 'addCart', state: 'disabled' },
      { key: 'addDrafts', state: 'disabled' },
      { key: 'remove', state: 'disabled' },
    ],
  },
]

export const OVERLAY_KEYS = ['addCart', 'addDrafts', 'remove'] as const

export type OverlayKey = (typeof OVERLAY_KEYS)[number]

export const initialCardPanelOverlayToolbarState: CardPanelOverlayToolbarState =
  Object.fromEntries(
    flattenIcons(CARD_PANEL_OVERLAY_TOOLBAR)
  ) as CardPanelOverlayToolbarState

export interface CardPanelOverlaySectionConfig
  extends BaseSectionConfig<
    CardPanelOverlayToolbarState,
    OverlayKey,
    'cardPanelOverlay'
  > {}
