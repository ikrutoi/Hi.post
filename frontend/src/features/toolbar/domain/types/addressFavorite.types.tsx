import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const ADDRESS_FAVORITE_KEYS = [
  'favorite',
] as const satisfies readonly IconKey[]

export type AddressFavoriteKey = (typeof ADDRESS_FAVORITE_KEYS)[number]

export interface AddressFavoriteToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const ADDRESS_FAVORITE_TOOLBAR: ToolbarConfig = [
  {
    group: 'addressFavorite',
    icons: [{ key: 'favorite', state: 'enabled' }],
    status: 'enabled',
  },
]

export const initialRecipientFavoriteToolbarState: AddressFavoriteToolbarState =
  {
    ...Object.fromEntries(flattenIcons(ADDRESS_FAVORITE_TOOLBAR)),
    config: [...ADDRESS_FAVORITE_TOOLBAR],
  }

export const initialSenderFavoriteToolbarState: AddressFavoriteToolbarState = {
  ...Object.fromEntries(flattenIcons(ADDRESS_FAVORITE_TOOLBAR)),
  config: [...ADDRESS_FAVORITE_TOOLBAR],
}

export interface FavoriteConfig extends BaseSectionConfig<
  AddressFavoriteToolbarState,
  AddressFavoriteKey,
  'recipientFavorite' | 'senderFavorite'
> {}
