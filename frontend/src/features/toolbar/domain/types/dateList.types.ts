import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const DATE_LIST_KEYS = [
  'listDelete',
  'sortDown',
  'cart',
  'postcardReady',
  'postcardSend',
  'postcardDelivered',
  'postcardNotDelivered',
  'postcardIndicator',
] as const satisfies readonly IconKey[]

export type DateListKey = (typeof DATE_LIST_KEYS)[number]

export interface DateListToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const DATE_LIST_TOOLBAR: ToolbarConfig = [
  {
    group: 'dateList',
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

export const DATE_LIST_INDICATORS_TOOLBAR: ToolbarConfig = [
  {
    group: 'dateListIndicators',
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

export const initialDateListToolbarState: DateListToolbarState = {
  ...Object.fromEntries(flattenIcons(DATE_LIST_TOOLBAR)),
  config: [...DATE_LIST_TOOLBAR],
}

export const initialDateListIndicatorsToolbarState: DateListToolbarState = {
  ...Object.fromEntries(flattenIcons(DATE_LIST_INDICATORS_TOOLBAR)),
  config: [...DATE_LIST_INDICATORS_TOOLBAR],
}

export interface DateListConfig extends BaseSectionConfig<
  DateListToolbarState,
  DateListKey,
  'dateList' | 'dateListIndicators'
> {}
