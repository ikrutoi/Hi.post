import { flattenIcons } from '../helpers'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const HISTORY_KEYS = ['history'] as const

export type HistoryKey = (typeof HISTORY_KEYS)[number]

export interface HistoryToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export interface BaseToolbarState extends Record<string, any> {
  config: ToolbarConfig
}

export const HISTORY_TOOLBAR: ToolbarConfig = [
  {
    group: 'history',
    icons: [{ key: 'history', state: 'enabled' }],
    status: 'enabled',
  },
]

export const initialHistoryToolbarState: HistoryToolbarState = {
  ...Object.fromEntries(flattenIcons(HISTORY_TOOLBAR)),
  config: [...HISTORY_TOOLBAR],
}

export interface HistorySectionConfig extends BaseSectionConfig<
  HistoryToolbarState,
  HistoryKey,
  'history'
> {}
