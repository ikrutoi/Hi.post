import { flattenIcons } from '../helpers'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const POSTCARD_PIE_CART_KEYS = ['cardPieEdit', 'delete'] as const

export type PostcardPieCartKey = (typeof POSTCARD_PIE_CART_KEYS)[number]

export const POSTCARD_PIE_CART_TOOLBAR: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'cardPieEdit', state: 'enabled' },
      { key: 'delete', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export interface PostcardPieCartToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const initialPostcardPieCartToolbarState: PostcardPieCartToolbarState = {
  ...Object.fromEntries(flattenIcons(POSTCARD_PIE_CART_TOOLBAR)),
  config: [...POSTCARD_PIE_CART_TOOLBAR],
}

export interface PostcardPieSectionConfig extends BaseSectionConfig<
  PostcardPieCartToolbarState,
  PostcardPieCartKey,
  'postcardPieCart'
> {}
