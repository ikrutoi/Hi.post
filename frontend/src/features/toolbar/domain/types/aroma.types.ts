import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const AROMA_KEYS = [
  'apply',
  'chevronLeft',
  'chevronRight',
  'close',
  'return',
] as const satisfies readonly IconKey[]

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
  {
    group: 'nav',
    icons: [
      { key: 'chevronLeft', state: 'disabled' },
      { key: 'chevronRight', state: 'disabled' },
    ],
    status: 'enabled',
  },
  {
    group: 'close',
    icons: [{ key: 'close', state: 'disabled' }],
    status: 'enabled',
  },
]

/** Mobile factory upper row: только apply при превью аромы. */
export const AROMA_PREVIEW_APPLY_TOOLBAR: ToolbarConfig = AROMA_TOOLBAR.filter(
  (group) => group.group === 'apply',
)

/** Mobile factory upper row: return справа. */
export const AROMA_PREVIEW_UPPER_RETURN_TOOLBAR: ToolbarConfig = [
  {
    group: 'close',
    icons: [{ key: 'return', state: 'disabled' }],
    status: 'enabled',
  },
]

/** Mobile factory lower row: навигация без apply и close. */
export const AROMA_PREVIEW_NAV_TOOLBAR: ToolbarConfig = AROMA_TOOLBAR.filter(
  (group) => group.group === 'nav',
)

export const initialAromaToolbarState: AromaToolbarState = {
  ...Object.fromEntries(flattenIcons(AROMA_TOOLBAR)),
  config: [...AROMA_TOOLBAR],
}

export interface AromaSectionConfig extends BaseSectionConfig<
  AromaToolbarState,
  AromaKey,
  'aroma'
> {}
