import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'
import { DateListToolbarState } from './dateList.types'

export const HISTORY_LIST_KEYS = [
  'listDelete',
  'sort131Up',
  'sort131Down',
  'sortAZDown',
  'sortAZUp',
  'historyPanel',
  'historyPanelDensity',
  'cart',
  'postcardReady',
  'postcardSend',
  'postcardDelivered',
  'postcardNotDelivered',
  'panelDensity2',
] as const satisfies readonly IconKey[]

export type HistoryListKey = (typeof HISTORY_LIST_KEYS)[number]

export interface HistoryListToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const HISTORY_LIST_TOOLBAR: ToolbarConfig = [
  {
    group: 'historyList',
    icons: [
      { key: 'panelDensity2', state: 'enabled' },
      { key: 'sort131Down', state: 'enabled' },
    ],
    status: 'enabled',
  },
  {
    group: 'listDelete',
    icons: [{ key: 'listDelete', state: 'enabled' }],
    status: 'enabled',
  },
]

/** Mobile factory: нижний ряд списка истории. */
export const HISTORY_LIST_FACTORY_LOWER_TOOLBAR: ToolbarConfig = [
  {
    group: 'historyList',
    icons: [
      { key: 'panelDensity2', state: 'enabled' },
      { key: 'sort131Down', state: 'enabled' },
    ],
    status: 'enabled',
  },
  {
    group: 'listDelete',
    icons: [{ key: 'listDelete', state: 'enabled' }],
    status: 'enabled',
  },
]

export const HISTORY_LIST_INDICATORS_TOOLBAR: ToolbarConfig = [
  {
    group: 'historyListIndicators',
    icons: [
      { key: 'cart', state: 'enabled' },
      { key: 'postcardReady', state: 'enabled' },
      { key: 'postcardSend', state: 'enabled' },
      { key: 'postcardDelivered', state: 'enabled' },
      { key: 'postcardNotDelivered', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialHistoryListToolbarState: HistoryListToolbarState = {
  ...Object.fromEntries(flattenIcons(HISTORY_LIST_TOOLBAR)),
  config: [...HISTORY_LIST_TOOLBAR],
}

export const initialHistoryListIndicatorsToolbarState: HistoryListToolbarState =
  {
    ...Object.fromEntries(flattenIcons(HISTORY_LIST_INDICATORS_TOOLBAR)),
    config: [...HISTORY_LIST_INDICATORS_TOOLBAR],
  }

export interface DateListConfig extends BaseSectionConfig<
  HistoryListToolbarState,
  HistoryListKey,
  'historyList' | 'historyListIndicators'
> {}
