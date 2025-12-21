import { flattenIcons } from '../helpers'
import type { IconKey, IconState } from '@shared/config/constants'
import type { BaseSectionConfig } from './toolbar.types'

export const ENVELOPE_KEYS = [
  'save',
  'delete',
  'addressTemplates',
] as const satisfies readonly IconKey[]

export type EnvelopeKey = (typeof ENVELOPE_KEYS)[number]

export type EnvelopeToolbarState = Record<EnvelopeKey, IconState>

export const ENVELOPE_TOOLBAR: {
  group: string
  icons: { key: EnvelopeKey; state: IconState }[]
}[] = [
  {
    group: 'address',
    icons: [
      { key: 'save', state: 'disabled' },
      { key: 'delete', state: 'disabled' },
      { key: 'addressTemplates', state: 'disabled' },
    ],
  },
]

export const initialSenderToolbarState: EnvelopeToolbarState =
  Object.fromEntries(flattenIcons(ENVELOPE_TOOLBAR)) as EnvelopeToolbarState

export const initialRecipientToolbarState: EnvelopeToolbarState =
  Object.fromEntries(flattenIcons(ENVELOPE_TOOLBAR)) as EnvelopeToolbarState

export interface EnvelopeSectionConfig extends BaseSectionConfig<
  EnvelopeToolbarState,
  EnvelopeKey,
  'sender' | 'recipient'
> {}
