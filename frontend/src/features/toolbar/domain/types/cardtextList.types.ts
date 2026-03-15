import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const CARDTEXT_LIST_KEYS = [
  // 'search',
  'listDelete',
  // 'listApply',
  'sortDown',
] as const satisfies readonly IconKey[]

export type CardtextListKey = (typeof CARDTEXT_LIST_KEYS)[number]

export interface CardtextListToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const CARDTEXT_LIST_TOOLBAR: ToolbarConfig = [
  {
    group: 'cardtext',
    icons: [{ key: 'sortDown', state: 'enabled' }],
    status: 'enabled',
  },
  {
    group: 'actions',
    icons: [{ key: 'listDelete', state: 'enabled' }],
    status: 'enabled',
  },
]

export const initialCardtextListToolbarState: CardtextListToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDTEXT_LIST_TOOLBAR)),
  config: [...CARDTEXT_LIST_TOOLBAR],
}

export interface CardtextListConfig extends BaseSectionConfig<
  CardtextListToolbarState,
  CardtextListKey,
  'cardtextList'
> {}
