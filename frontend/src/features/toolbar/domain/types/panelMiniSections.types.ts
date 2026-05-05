import { flattenIcons } from '../helpers'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const PANEL_MINI_SECTIONS_KEYS = ['cardPieCheck'] as const

export type PanelMiniSectionsKey = (typeof PANEL_MINI_SECTIONS_KEYS)[number]

export const PANEL_MINI_SECTIONS_TOOLBAR: ToolbarConfig = [
  {
    group: 'main',
    icons: [{ key: 'cardPieCheck', state: 'enabled' }],
    status: 'enabled',
  },
]

export interface PanelMiniSectionsToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const initialPanelMiniSectionsToolbarState: PanelMiniSectionsToolbarState =
  {
    ...Object.fromEntries(flattenIcons(PANEL_MINI_SECTIONS_TOOLBAR)),
    config: [...PANEL_MINI_SECTIONS_TOOLBAR],
  }

export interface PanelMiniSectionsSectionConfig extends BaseSectionConfig<
  PanelMiniSectionsToolbarState,
  PanelMiniSectionsKey,
  'panelMiniSections'
> {}
