import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const CARDPHOTO_LIST_KEYS = [
  'listDelete',
  'sortDown',
  'sortUp',
  'sortAZDown',
  'sortAZUp',
  'panelDensity2',
] as const satisfies readonly IconKey[]

export type CardphotoListKey = (typeof CARDPHOTO_LIST_KEYS)[number]

export interface CardphotoListToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const CARDPHOTO_LIST_TOOLBAR: ToolbarConfig = [
  {
    group: 'cardphotoList',
    icons: [
      { key: 'panelDensity2', state: 'enabled' },
      { key: 'sortDown', state: 'enabled' },
    ],
    status: 'enabled',
  },
  {
    group: 'actions',
    icons: [{ key: 'listDelete', state: 'enabled' }],
    status: 'enabled',
  },
]

export const initialCardphotoListToolbarState: CardphotoListToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDPHOTO_LIST_TOOLBAR)),
  config: [...CARDPHOTO_LIST_TOOLBAR],
}

export interface CardphotoListConfig extends BaseSectionConfig<
  CardphotoListToolbarState,
  CardphotoListKey,
  'cardphotoList'
> {}
