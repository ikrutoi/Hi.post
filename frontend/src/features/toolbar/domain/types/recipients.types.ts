import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const RECIPIENTS_KEYS = [
  'listClose',
  'addressList',
  'apply',
  'addressPlus',
] as const satisfies readonly IconKey[]

export type RecipientsKey = (typeof RECIPIENTS_KEYS)[number]

export interface RecipientsToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const RECIPIENTS_TOOLBAR: ToolbarConfig = [
  {
    group: 'recipients',
    icons: [
      { key: 'addressList', state: 'disabled' },
      { key: 'apply', state: 'enabled' },
      { key: 'addressPlus', state: 'enabled' },
      { key: 'listClose', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialRecipientsToolbarState: RecipientsToolbarState = {
  ...Object.fromEntries(flattenIcons(RECIPIENTS_TOOLBAR)),
  config: [...RECIPIENTS_TOOLBAR],
}

export interface RecipientsConfig extends BaseSectionConfig<
  RecipientsToolbarState,
  RecipientsKey,
  'recipients'
> {}
