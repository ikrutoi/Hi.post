import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const SAVED_ADDRESS_KEYS = [
  'edit',
  'delete',
  'favorite',
  'listClose',
] as const satisfies readonly IconKey[]

export type SavedAddressKey = (typeof SAVED_ADDRESS_KEYS)[number]

export interface SavedAddressToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const RECIPIENT_SAVED_ADDRESS_TOOLBAR: ToolbarConfig = [
  {
    group: 'recipientSavedAddress',
    icons: [
      { key: 'edit', state: 'enabled' },
      { key: 'delete', state: 'enabled' },
      { key: 'favorite', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialRecipientSavedAddressToolbarState: SavedAddressToolbarState =
  {
    ...Object.fromEntries(flattenIcons(RECIPIENT_SAVED_ADDRESS_TOOLBAR)),
    config: [...RECIPIENT_SAVED_ADDRESS_TOOLBAR],
  }

export const RECIPIENTS_SAVED_ADDRESS_TOOLBAR: ToolbarConfig = [
  {
    group: 'recipientsSavedAddress',
    icons: [
      { key: 'edit', state: 'enabled' },
      { key: 'listClose', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialRecipientsSavedAddressToolbarState: SavedAddressToolbarState =
  {
    ...Object.fromEntries(flattenIcons(RECIPIENTS_SAVED_ADDRESS_TOOLBAR)),
    config: [...RECIPIENTS_SAVED_ADDRESS_TOOLBAR],
  }

export const SENDER_SAVED_ADDRESS_TOOLBAR: ToolbarConfig = [
  {
    group: 'senderSavedAddress',
    icons: [
      { key: 'edit', state: 'enabled' },
      { key: 'delete', state: 'enabled' },
      { key: 'favorite', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialSenderSavedAddressToolbarState: SavedAddressToolbarState = {
  ...Object.fromEntries(flattenIcons(SENDER_SAVED_ADDRESS_TOOLBAR)),
  config: [...SENDER_SAVED_ADDRESS_TOOLBAR],
}

export interface SavedAddressSectionConfig extends BaseSectionConfig<
  SavedAddressToolbarState,
  SavedAddressKey,
  'senderSavedAddress' | 'recipientSavedAddress' | 'recipientsSavedAddress'
> {}
