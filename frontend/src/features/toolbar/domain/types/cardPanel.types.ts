import { flattenIcons } from '../helpers'
import type { IconState } from '@shared/config/constants'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const CARD_PANEL_TOOLBAR: ToolbarConfig = [
  {
    group: 'panel',
    icons: [
      { key: 'addCart', state: 'enabled' },
      { key: 'addDrafts', state: 'enabled' },
      { key: 'delete', state: 'enabled' },
    ],
  },
]

export const PANEL_KEYS = ['addCart', 'drafts', 'remove'] as const

export type PanelKey = (typeof PANEL_KEYS)[number]

export type CardPanelToolbarState = Record<PanelKey, IconState>

export const initialCardPanelToolbarState: CardPanelToolbarState =
  Object.fromEntries(flattenIcons(CARD_PANEL_TOOLBAR)) as CardPanelToolbarState

export interface CardPanelSectionConfig
  extends BaseSectionConfig<CardPanelToolbarState, PanelKey, 'cardPanel'> {}
