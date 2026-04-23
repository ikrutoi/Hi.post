import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const CARD_PIE_LIST_KEYS = [
  'listDelete',
  'sortDown',
  'addCart',
  'cart',
  'favorite',
  'delete',
  'postcardReady',
  'postcardSend',
  'postcardDelivered',
  'postcardNotDelivered',
  'postcardIndicator',
] as const satisfies readonly IconKey[]

export type CardPieListKey = (typeof CARD_PIE_LIST_KEYS)[number]

export interface CardPieListToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const CARD_PIE_LIST_TOOLBAR: ToolbarConfig = [
  {
    group: 'cardPieList',
    icons: [{ key: 'sortDown', state: 'enabled' }],
    status: 'enabled',
  },
  {
    group: 'actions',
    icons: [{ key: 'listDelete', state: 'enabled' }],
    status: 'enabled',
  },
]

export const initialCardPieListToolbarState: CardPieListToolbarState = {
  ...Object.fromEntries(flattenIcons(CARD_PIE_LIST_TOOLBAR)),
  config: [...CARD_PIE_LIST_TOOLBAR],
}

export interface CardPieListConfig extends BaseSectionConfig<
  CardPieListToolbarState,
  CardPieListKey,
  'cardPieList'
> {}
