import { flattenIcons } from '../helpers'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const CARD_PANEL_TOOLBAR: ToolbarConfig = [
  {
    group: 'panel',
    icons: [
      { key: 'addCart', state: 'enabled' },
      { key: 'addDrafts', state: 'enabled' },
      { key: 'delete', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const PANEL_KEYS = ['addCart', 'addDrafts', 'delete'] as const

export type PanelKey = (typeof PANEL_KEYS)[number]

export interface CardPanelToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const initialCardPanelToolbarState: CardPanelToolbarState = {
  ...Object.fromEntries(flattenIcons(CARD_PANEL_TOOLBAR)),
  config: [...CARD_PANEL_TOOLBAR],
}

export interface CardPanelSectionConfig extends BaseSectionConfig<
  CardPanelToolbarState,
  PanelKey,
  'cardPanel'
> {}
