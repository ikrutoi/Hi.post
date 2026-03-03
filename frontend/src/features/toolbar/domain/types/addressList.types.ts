import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const ADDRESS_LIST_KEYS = [
  // 'search',
  'listDelete',
  'listApply',
] as const satisfies readonly IconKey[]

export type AddressListKey = (typeof ADDRESS_LIST_KEYS)[number]

export interface AddressListToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const ADDRESS_LIST_SENDER_TOOLBAR: ToolbarConfig = [
  {
    group: 'address',
    icons: [{ key: 'listDelete', state: 'enabled' }],
    status: 'enabled',
  },
]

export const ADDRESS_LIST_RECIPIENT_TOOLBAR: ToolbarConfig = [
  {
    group: 'address',
    icons: [
      { key: 'listApply', state: 'disabled' },
      { key: 'listDelete', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialAddressListSenderToolbarState: AddressListToolbarState = {
  ...Object.fromEntries(flattenIcons(ADDRESS_LIST_SENDER_TOOLBAR)),
  config: [...ADDRESS_LIST_SENDER_TOOLBAR],
}

export const initialAddressListRecipientToolbarState: AddressListToolbarState =
  {
    ...Object.fromEntries(flattenIcons(ADDRESS_LIST_RECIPIENT_TOOLBAR)),
    config: [...ADDRESS_LIST_RECIPIENT_TOOLBAR],
  }

export interface AddressListSenderConfig extends BaseSectionConfig<
  AddressListToolbarState,
  AddressListKey,
  'addressListSender'
> {}

export interface AddressListRecipientConfig extends BaseSectionConfig<
  AddressListToolbarState,
  AddressListKey,
  'addressListRecipient'
> {}
