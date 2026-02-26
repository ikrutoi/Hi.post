import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const ADDRESS_LIST_KEYS = [
  'search',
  'listDelete',
] as const satisfies readonly IconKey[]

export type AddressListKey = (typeof ADDRESS_LIST_KEYS)[number]

export interface AddressListToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const ADDRESS_LIST_TOOLBAR: ToolbarConfig = [
  {
    group: 'address',
    icons: [
      { key: 'search', state: 'enabled' },
      { key: 'listDelete', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialAddressListToolbarState: AddressListToolbarState = {
  ...Object.fromEntries(flattenIcons(ADDRESS_LIST_TOOLBAR)),
  config: [...ADDRESS_LIST_TOOLBAR],
}

export interface AddressListConfig extends BaseSectionConfig<
  AddressListToolbarState,
  AddressListKey,
  'addressList'
> {}
