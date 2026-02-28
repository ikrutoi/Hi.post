import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const ENVELOPE_KEYS = [
  'addressList',
  'apply',
  'addressPlus',
  'listAdd',
  // 'listClose',
] as const satisfies readonly IconKey[]

export type EnvelopeKey = (typeof ENVELOPE_KEYS)[number]

export interface EnvelopeToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const SENDER_TOOLBAR: ToolbarConfig = [
  {
    group: 'address',
    icons: [
      { key: 'addressList', state: 'disabled' },
      { key: 'apply', state: 'disabled' },
      { key: 'addressPlus', state: 'enabled' },
      { key: 'listAdd', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

export const initialSenderToolbarState: EnvelopeToolbarState = {
  ...Object.fromEntries(flattenIcons(SENDER_TOOLBAR)),
  config: [...SENDER_TOOLBAR],
}

export const RECIPIENT_TOOLBAR: ToolbarConfig = [
  {
    group: 'recipient',
    icons: [
      { key: 'addressList', state: 'disabled' },
      { key: 'apply', state: 'disabled' },
      { key: 'addressPlus', state: 'enabled' },
      { key: 'listAdd', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

export const initialRecipientToolbarState: EnvelopeToolbarState = {
  ...Object.fromEntries(flattenIcons(RECIPIENT_TOOLBAR)),
  config: [...RECIPIENT_TOOLBAR],
}

export const RECIPIENTS_KEYS = [
  'listClose',
  'addressList',
  'apply',
  'addressPlus',
] as const satisfies readonly IconKey[]

export type RecipientsKey = (typeof RECIPIENTS_KEYS)[number]

export const RECIPIENTS_TOOLBAR: ToolbarConfig = [
  {
    group: 'recipients',
    icons: [
      { key: 'addressList', state: 'disabled' },
      { key: 'apply', state: 'enabled' },
      { key: 'addressPlus', state: 'enabled' },
      // { key: 'listClose', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialRecipientsToolbarState: EnvelopeToolbarState = {
  ...Object.fromEntries(flattenIcons(RECIPIENTS_TOOLBAR)),
  config: [...RECIPIENTS_TOOLBAR],
}

export type RecipientsToolbarState = EnvelopeToolbarState

export interface EnvelopeSectionConfig extends BaseSectionConfig<
  EnvelopeToolbarState,
  EnvelopeKey,
  'sender' | 'recipient' | 'recipients'
> {}

// export interface RecipientAddressViewSectionConfig extends BaseSectionConfig<
//   EnvelopeToolbarState,
//   EnvelopeKey,
//   'recipientView'
// > {}
