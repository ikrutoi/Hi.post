import { flattenIcons } from '../helpers'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const DATE_KEYS = ['apply', 'listDate'] as const

export type DateKey = (typeof DATE_KEYS)[number]

export interface DateToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export interface BaseToolbarState extends Record<string, any> {
  config: ToolbarConfig
}

export const DATE_TOOLBAR: ToolbarConfig = [
  {
    group: 'date',
    icons: [{ key: 'listDate', state: 'enabled' }],
    status: 'enabled',
  },
]

export const initialDateToolbarState: DateToolbarState = {
  ...Object.fromEntries(flattenIcons(DATE_TOOLBAR)),
  config: [...DATE_TOOLBAR],
}

export interface DateSectionConfig extends BaseSectionConfig<
  DateToolbarState,
  DateKey,
  'date'
> {}
