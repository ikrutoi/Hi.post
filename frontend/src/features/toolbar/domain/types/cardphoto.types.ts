import { flattenIcons } from '../helpers'
import type { IconValue } from '@shared/config/constants'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const CARDPHOTO_KEYS = [
  'cardOrientation',
  'imageRotateLeft',
  'imageRotateRight',
  'imageReset',
  'crop',
  'cropFull',
  'cropCheck',
  'cropDelete',
  'apply',
  'download',
  'close',
  'save',
  'photoTemplates',
  'cropHistory',
] as const

export type CardphotoKey = (typeof CARDPHOTO_KEYS)[number]

export interface CardphotoToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export interface BaseToolbarState extends Record<string, any> {
  config: ToolbarConfig
}

export const CARDPHOTO_TOOLBAR: ToolbarConfig = [
  {
    group: 'photo',
    icons: [
      { key: 'cardOrientation', state: 'disabled' },
      { key: 'imageRotateLeft', state: 'disabled' },
      { key: 'imageRotateRight', state: 'disabled' },
      { key: 'imageReset', state: 'disabled' },
      { key: 'crop', state: 'disabled' },
      { key: 'cropFull', state: 'disabled' },
      { key: 'cropCheck', state: 'disabled' },
      { key: 'cropDelete', state: 'disabled' },
      { key: 'cropHistory', state: 'disabled' },
    ],
    status: 'enabled',
  },
  {
    group: 'ui',
    icons: [
      { key: 'apply', state: 'enabled' },
      { key: 'download', state: 'enabled' },
      { key: 'save', state: 'enabled' },
      { key: 'close', state: 'disabled' },
      { key: 'photoTemplates', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

export const initialCardphotoToolbarState: CardphotoToolbarState = {
  ...(Object.fromEntries(flattenIcons(CARDPHOTO_TOOLBAR)) as Record<
    CardphotoKey,
    IconValue
  >),
  config: [...CARDPHOTO_TOOLBAR],
}

export interface CardphotoSectionConfig extends BaseSectionConfig<
  CardphotoToolbarState,
  CardphotoKey,
  'cardphoto'
> {}
