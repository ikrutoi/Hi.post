import { flattenIcons } from '../helpers'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const POSTCARD_PIE_CART_KEYS = [
  'editLight',
  'cardPieCopy',
  'delete',
] as const

export type PostcardPieCartKey = (typeof POSTCARD_PIE_CART_KEYS)[number]

export const POSTCARD_PIE_HISTORY_KEYS = ['cardPieCopy', 'delete'] as const

export type PostcardPieHistoryKey = (typeof POSTCARD_PIE_HISTORY_KEYS)[number]

export const POSTCARD_PIE_CART_TOOLBAR: ToolbarConfig = [
  {
    group: 'cardPieCart',
    icons: [
      { key: 'editLight', state: 'enabled' },
      { key: 'cardPieCopy', state: 'enabled' },
      { key: 'delete', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const POSTCARD_PIE_HISTORY_TOOLBAR: ToolbarConfig = [
  {
    group: 'cardPieHistory',
    icons: [
      { key: 'cardPieCopy', state: 'enabled' },
      { key: 'delete', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export interface PostcardPieCartToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export interface PostcardPieHistoryToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const initialPostcardPieCartToolbarState: PostcardPieCartToolbarState = {
  ...Object.fromEntries(flattenIcons(POSTCARD_PIE_CART_TOOLBAR)),
  config: [...POSTCARD_PIE_CART_TOOLBAR],
}

export const initialPostcardPieHistoryToolbarState: PostcardPieHistoryToolbarState =
  {
    ...Object.fromEntries(flattenIcons(POSTCARD_PIE_HISTORY_TOOLBAR)),
    config: [...POSTCARD_PIE_HISTORY_TOOLBAR],
  }

export interface PostcardPieCartSectionConfig extends BaseSectionConfig<
  PostcardPieCartToolbarState,
  PostcardPieCartKey,
  'postcardPieCart'
> {}

export interface PostcardPieHistorySectionConfig extends BaseSectionConfig<
  PostcardPieHistoryToolbarState,
  PostcardPieHistoryKey,
  'postcardPieHistory'
> {}
