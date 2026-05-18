import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const VIEW_KEYS = [
  'edit',
  'delete',
  'listClose',
  'listAdd',
  'close',
  'sortUp',
  'sortDown',
  'apply',
  'addressCheck',
  'addList',
  'removeFromList',
  'listDelete',
  'applyLight',
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
      { key: 'addList', state: 'enabled' },
      // { key: 'edit', state: 'enabled' },
      // { key: 'delete', state: 'enabled' },
    ],
    status: 'enabled',
  },
  // {
  //   group: 'actions',
  //   icons: [{ key: 'delete', state: 'enabled' }],
  //   status: 'enabled',
  // },
]

export const initialRecipientViewToolbarState: AddressViewToolbarState = {
  ...Object.fromEntries(flattenIcons(RECIPIENT_VIEW_TOOLBAR)),
  config: [...RECIPIENT_VIEW_TOOLBAR],
}

export const RECIPIENTS_VIEW_TOOLBAR: ToolbarConfig = [
  // {
  //   group: 'recipientsView',
  //   icons: [{ key: 'sortDown', state: 'enabled' }],
  //   status: 'enabled',
  // },
  {
    group: 'actions',
    icons: [{ key: 'listDelete', state: 'enabled' }],
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
      { key: 'addList', state: 'enabled' },
      // { key: 'edit', state: 'enabled' },
    ],
    status: 'enabled',
  },
  // {
  //   group: 'actions',
  //   icons: [{ key: 'delete', state: 'enabled' }],
  //   status: 'enabled',
  // },
]

export const initialSenderViewToolbarState: AddressViewToolbarState = {
  ...Object.fromEntries(flattenIcons(SENDER_VIEW_TOOLBAR)),
  config: [...SENDER_VIEW_TOOLBAR],
}

export const SENDER_CREATE_TOOLBAR: ToolbarConfig = [
  {
    group: 'senderCreate',
    icons: [
      { key: 'addList', state: 'disabled' },
      { key: 'applyLight', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

export const RECIPIENT_CREATE_TOOLBAR: ToolbarConfig = [
  {
    group: 'recipientCreate',
    icons: [
      { key: 'addList', state: 'disabled' },
      { key: 'applyLight', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

export const initialSenderCreateToolbarState: AddressViewToolbarState = {
  ...Object.fromEntries(flattenIcons(SENDER_CREATE_TOOLBAR)),
  config: [...SENDER_CREATE_TOOLBAR],
}

export const initialRecipientCreateToolbarState: AddressViewToolbarState = {
  ...Object.fromEntries(flattenIcons(RECIPIENT_CREATE_TOOLBAR)),
  config: [...RECIPIENT_CREATE_TOOLBAR],
}

export interface AddressViewSectionConfig extends BaseSectionConfig<
  AddressViewToolbarState,
  AddressViewKey,
  | 'senderView'
  | 'recipientView'
  | 'recipientsView'
  | 'senderCreate'
  | 'recipientCreate'
> {}
