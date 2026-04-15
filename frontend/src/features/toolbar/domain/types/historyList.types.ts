import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'
import { DATE_LIST_TOOLBAR, DateListKey } from './dateList.types'
import { DateListToolbarState } from './dateList.types'

export const HISTORY_LIST_KEYS = [
  'listDelete',
  'sortDown',
  'cart',
  'postcardReady',
  'postcardSend',
  'postcardDelivered',
  'postcardNotDelivered',
  'postcardIndicator',
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
      { key: 'sortDown', state: 'enabled' },
      { key: 'postcardIndicator', state: 'enabled' },
    ],
    status: 'enabled',
  },
  {
    group: 'actions',
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
