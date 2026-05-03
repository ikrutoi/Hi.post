import { flattenIcons } from '../helpers'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const CART_KEYS = ['cart'] as const

export type CartKey = (typeof CART_KEYS)[number]

export interface CartToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const CART_TOOLBAR: ToolbarConfig = [
  {
    group: 'cart',
    icons: [{ key: 'cart', state: 'enabled' }],
    status: 'enabled',
  },
]

export const initialCartToolbarState: CartToolbarState = {
  ...Object.fromEntries(flattenIcons(CART_TOOLBAR)),
  config: [...CART_TOOLBAR],
}

export interface CartSectionConfig extends BaseSectionConfig<
  CartToolbarState,
  CartKey,
  'cart'
> {}
