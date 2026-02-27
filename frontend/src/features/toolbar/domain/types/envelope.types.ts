import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const ENVELOPE_KEYS = [
  'close',
  'addressPlus',
  'addressList',
  'apply',
  'listAdd',
  'listClose',
  // 'deleteList',
] as const satisfies readonly IconKey[]

export type EnvelopeKey = (typeof ENVELOPE_KEYS)[number]

export interface EnvelopeToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const RECIPIENT_TOOLBAR: ToolbarConfig = [
  {
    group: 'address',
    icons: [
      { key: 'addressList', state: 'disabled' },
      { key: 'apply', state: 'disabled' },
      { key: 'addressPlus', state: 'enabled' },
      { key: 'listAdd', state: 'disabled' },
      // { key: 'listClose', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

export const SENDER_TOOLBAR: ToolbarConfig = [
  {
    group: 'address',
    icons: [
      { key: 'addressList', state: 'disabled' },
      { key: 'apply', state: 'disabled' },
      { key: 'addressPlus', state: 'enabled' },
      { key: 'listAdd', state: 'disabled' },
      // { key: 'close', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

// export const RECIPIENT_SAVED_ADDRESS_TOOLBAR: ToolbarConfig = [
//   {
//     group: 'recipientSavedAddress',
//     icons: [
//       { key: 'addressList', state: 'disabled' },
//       { key: 'apply', state: 'enabled' },
//       { key: 'listAdd', state: 'disabled' },
//       // { key: 'addressPlus', state: 'enabled' },
//     ],
//     status: 'enabled',
//   },
// ]

export const initialSenderToolbarState: EnvelopeToolbarState = {
  ...Object.fromEntries(flattenIcons(SENDER_TOOLBAR)),
  config: [...SENDER_TOOLBAR],
}

export const initialRecipientToolbarState: EnvelopeToolbarState = {
  ...Object.fromEntries(flattenIcons(RECIPIENT_TOOLBAR)),
  config: [...RECIPIENT_TOOLBAR],
}

// export const initialRecipientSavedAddressToolbarState: EnvelopeToolbarState = {
//   ...Object.fromEntries(flattenIcons(RECIPIENT_SAVED_ADDRESS_TOOLBAR)),
//   config: [...RECIPIENT_SAVED_ADDRESS_TOOLBAR],
// }

export interface EnvelopeSectionConfig extends BaseSectionConfig<
  EnvelopeToolbarState,
  EnvelopeKey,
  'sender' | 'recipient'
> {}

// export interface RecipientSavedAddressSectionConfig extends BaseSectionConfig<
//   EnvelopeToolbarState,
//   EnvelopeKey,
//   'recipientSavedAddress'
// > {}
