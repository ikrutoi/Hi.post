import { flattenIcons } from '../helpers'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const CARDPHOTO_KEYS = [
  'cardOrientation',
  'imageRotateLeft',
  'imageRotateRight',
  'imageReset',
  'crop',
  'cropFull',
  'cropCheck',
  // 'cropDelete',
  'apply',
  'download',
  'close',
  // 'save',
  // 'photoTemplates',
  'cropHistory',
  'closeList',
  'saveList',
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
      {
        key: 'cardOrientation',
        state: 'disabled',
        options: { orientation: 'landscape' },
      },
      { key: 'imageRotateLeft', state: 'disabled' },
      { key: 'imageRotateRight', state: 'disabled' },
      { key: 'crop', state: 'disabled' },
      { key: 'cropFull', state: 'disabled' },
      { key: 'cropCheck', state: 'disabled' },
      { key: 'imageReset', state: 'disabled' },
    ],
    status: 'enabled',
  },
  {
    group: 'ui',
    icons: [
      { key: 'apply', state: 'enabled' },
      { key: 'download', state: 'enabled' },
      { key: 'close', state: 'disabled' },
    ],
    status: 'enabled',
  },
  {
    group: 'processed',
    icons: [
      { key: 'saveList', state: 'disabled' },
      { key: 'closeList', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

export const initialCardphotoToolbarState: CardphotoToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDPHOTO_TOOLBAR)),
  config: [...CARDPHOTO_TOOLBAR],
}

export interface CardphotoSectionConfig extends BaseSectionConfig<
  CardphotoToolbarState,
  CardphotoKey,
  'cardphoto'
> {}
