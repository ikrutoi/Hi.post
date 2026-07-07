import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const AROMA_KEYS = ['apply', 'return'] as const satisfies readonly IconKey[]

export type AromaKey = (typeof AROMA_KEYS)[number]

export interface AromaToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const AROMA_TOOLBAR: ToolbarConfig = [
  {
    group: 'apply',
    icons: [{ key: 'apply', state: 'disabled' }],
    status: 'enabled',
  },
]

/** Mobile factory upper row: apply слева. */
export const AROMA_UPPER_APPLY_TOOLBAR: ToolbarConfig = AROMA_TOOLBAR

/** Mobile factory upper row: return справа. */
export const AROMA_UPPER_RETURN_TOOLBAR: ToolbarConfig = [
  {
    group: 'close',
    icons: [{ key: 'return', state: 'disabled' }],
    status: 'enabled',
  },
]

export const initialAromaToolbarState: AromaToolbarState = {
  ...Object.fromEntries(flattenIcons(AROMA_TOOLBAR)),
  config: [...AROMA_TOOLBAR],
}

export interface AromaSectionConfig extends BaseSectionConfig<
  AromaToolbarState,
  AromaKey,
  'aroma'
> {}
