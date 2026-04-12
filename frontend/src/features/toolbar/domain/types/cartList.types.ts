import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const CART_LIST_KEYS = [
  'listDelete',
  'sortDown',
] as const satisfies readonly IconKey[]

export type CartListKey = (typeof CART_LIST_KEYS)[number]

export interface CartListToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const CART_LIST_TOOLBAR: ToolbarConfig = [
  {
    group: 'cartList',
    icons: [{ key: 'sortDown', state: 'enabled' }],
    status: 'enabled',
  },
  {
    group: 'actions',
    icons: [{ key: 'listDelete', state: 'enabled' }],
    status: 'enabled',
  },
]

export const initialCartListToolbarState: CartListToolbarState = {
  ...Object.fromEntries(flattenIcons(CART_LIST_TOOLBAR)),
  config: [...CART_LIST_TOOLBAR],
}

export interface CartListConfig extends BaseSectionConfig<
  CartListToolbarState,
  CartListKey,
  'cartList'
> {}
