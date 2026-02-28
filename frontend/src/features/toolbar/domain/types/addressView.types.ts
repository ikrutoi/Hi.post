import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const VIEW_KEYS = [
  'edit',
  'delete',
  'favorite',
  'listClose',
] as const satisfies readonly IconKey[]

export type AddressViewKey = (typeof VIEW_KEYS)[number]

export interface AddressViewToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const RECIPIENT_VIEW_TOOLBAR: ToolbarConfig = [
  {
    group: 'recipientView',
    icons: [
      { key: 'edit', state: 'enabled' },
      { key: 'delete', state: 'enabled' },
      { key: 'favorite', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialRecipientViewToolbarState: AddressViewToolbarState = {
  ...Object.fromEntries(flattenIcons(RECIPIENT_VIEW_TOOLBAR)),
  config: [...RECIPIENT_VIEW_TOOLBAR],
}

export const RECIPIENTS_VIEW_TOOLBAR: ToolbarConfig = [
  {
    group: 'recipientsView',
    icons: [{ key: 'listClose', state: 'enabled' }],
    status: 'enabled',
  },
]

export const initialRecipientsViewToolbarState: AddressViewToolbarState = {
  ...Object.fromEntries(flattenIcons(RECIPIENTS_VIEW_TOOLBAR)),
  config: [...RECIPIENTS_VIEW_TOOLBAR],
}

export const SENDER_VIEW_TOOLBAR: ToolbarConfig = [
  {
    group: 'senderView',
    icons: [
      { key: 'edit', state: 'enabled' },
      { key: 'delete', state: 'enabled' },
      { key: 'favorite', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialSenderViewToolbarState: AddressViewToolbarState = {
  ...Object.fromEntries(flattenIcons(SENDER_VIEW_TOOLBAR)),
  config: [...SENDER_VIEW_TOOLBAR],
}

export const ADDRESS_FORM_VIEW_TOOLBAR: ToolbarConfig = [
  {
    group: 'addressFormView',
    icons: [{ key: 'listClose', state: 'enabled' }],
    status: 'enabled',
  },
]

export const initialAddressFormViewToolbarState: AddressViewToolbarState = {
  ...Object.fromEntries(flattenIcons(ADDRESS_FORM_VIEW_TOOLBAR)),
  config: [...ADDRESS_FORM_VIEW_TOOLBAR],
}

export interface AddressViewSectionConfig extends BaseSectionConfig<
  AddressViewToolbarState,
  AddressViewKey,
  'senderView' | 'recipientView' | 'recipientsView' | 'addressFormView'
> {}
