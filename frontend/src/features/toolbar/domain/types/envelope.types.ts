import { flattenIcons } from '../helpers'
import type {
  IconKey,
  IconState,
  IconStateGroup,
} from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const ENVELOPE_KEYS = [
  'close',
  'save',
  'addressTemplates',
] as const satisfies readonly IconKey[]

export type EnvelopeKey = (typeof ENVELOPE_KEYS)[number]

export interface EnvelopeToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const ENVELOPE_TOOLBAR: ToolbarConfig = [
  {
    group: 'address',
    icons: [
      { key: 'close', state: 'disabled' },
      { key: 'save', state: 'disabled' },
      { key: 'addressTemplates', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

export const initialSenderToolbarState: EnvelopeToolbarState = {
  ...(Object.fromEntries(flattenIcons(ENVELOPE_TOOLBAR)) as Record<
    EnvelopeKey,
    IconState
  >),
  config: [...ENVELOPE_TOOLBAR],
}

export const initialRecipientToolbarState: EnvelopeToolbarState = {
  ...(Object.fromEntries(flattenIcons(ENVELOPE_TOOLBAR)) as Record<
    EnvelopeKey,
    IconState
  >),
  config: [...ENVELOPE_TOOLBAR],
}

export interface EnvelopeSectionConfig extends BaseSectionConfig<
  EnvelopeToolbarState,
  EnvelopeKey,
  'sender' | 'recipient'
> {}
