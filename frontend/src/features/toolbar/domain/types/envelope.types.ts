import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const ENVELOPE_KEYS = [
  'addressList',
  'apply',
  'addressAdd',
  'listAdd',
  // 'listClose',
] as const satisfies readonly IconKey[]

export type EnvelopeKey = (typeof ENVELOPE_KEYS)[number]

export interface EnvelopeToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const RECIPIENTS_KEYS = [
  'addressList',
  'apply',
  'addressAdd',
  'addressNext',
] as const satisfies readonly IconKey[]

export type RecipientsKey = (typeof RECIPIENTS_KEYS)[number]

export const RECIPIENTS_TOOLBAR: ToolbarConfig = [
  {
    group: 'recipients',
    icons: [
      { key: 'apply', state: 'enabled' },
      { key: 'addressAdd', state: 'enabled' },
      { key: 'addressList', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialRecipientsToolbarState: EnvelopeToolbarState = {
  ...Object.fromEntries(flattenIcons(RECIPIENTS_TOOLBAR)),
  config: [...RECIPIENTS_TOOLBAR],
}

/** Envelope Apply-peek (2+ Recipients): cycle addresses from the upper-right. */
export function recipientsApplyPeekAddressNextToolbar(
  count: number,
): ToolbarConfig {
  return [
    {
      group: 'next',
      icons: [
        {
          key: 'addressNext',
          state: 'enabled',
          options: { badge: count > 1 ? count : null },
        },
      ],
      status: 'enabled',
    },
  ]
}

export type RecipientsToolbarState = EnvelopeToolbarState

export interface EnvelopeSectionConfig extends BaseSectionConfig<
  EnvelopeToolbarState,
  EnvelopeKey,
  'recipients'
> {}

// export interface RecipientAddressViewSectionConfig extends BaseSectionConfig<
//   EnvelopeToolbarState,
//   EnvelopeKey,
//   'recipientView'
// > {}
