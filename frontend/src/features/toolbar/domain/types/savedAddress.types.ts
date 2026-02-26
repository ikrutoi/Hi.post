import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const SAVED_ADDRESS_KEYS = [
  'delete',
  'edit',
  'apply',
  'favorite',
] as const satisfies readonly IconKey[]

export type SavedAddressKey = (typeof SAVED_ADDRESS_KEYS)[number]

export interface SavedAddressToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const SAVED_ADDRESS_TOOLBAR: ToolbarConfig = [
  {
    group: 'savedAddress',
    icons: [
      // { key: 'apply', state: 'disabled' },
      { key: 'edit', state: 'enabled' },
      { key: 'delete', state: 'enabled' },
      { key: 'favorite', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialSavedAddressToolbarState: SavedAddressToolbarState = {
  ...Object.fromEntries(flattenIcons(SAVED_ADDRESS_TOOLBAR)),
  config: [...SAVED_ADDRESS_TOOLBAR],
}

export interface SavedAddressSectionConfig extends BaseSectionConfig<
  SavedAddressToolbarState,
  SavedAddressKey,
  'savedAddress'
> {}
