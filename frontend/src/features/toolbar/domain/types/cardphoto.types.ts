import { flattenIcons } from '../helpers'
import type { IconState } from '@shared/config/constants'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const CARDPHOTO_KEYS = [
  'rotateLeft',
  'rotateRight',
  'undo',
  'crop',
  'cropFull',
  'cropRotate',
  'cropCheck',
  'apply',
  'download',
  'close',
  'save',
  'photoTemplates',
] as const

export type CardphotoKey = (typeof CARDPHOTO_KEYS)[number]

export type CardphotoToolbarState = Record<CardphotoKey, IconState>

export const CARDPHOTO_TOOLBAR: ToolbarConfig = [
  {
    group: 'photo',
    icons: [
      { key: 'rotateLeft', state: 'enabled' },
      { key: 'rotateRight', state: 'enabled' },
      { key: 'undo', state: 'disabled' },
      { key: 'crop', state: 'enabled' },
      { key: 'cropRotate', state: 'disabled' },
      { key: 'cropFull', state: 'disabled' },
      { key: 'cropCheck', state: 'disabled' },
    ],
  },
  {
    group: 'ui',
    icons: [
      { key: 'apply', state: 'enabled' },
      { key: 'download', state: 'enabled' },
      { key: 'close', state: 'disabled' },
      { key: 'save', state: 'enabled' },
      { key: 'photoTemplates', state: 'disabled' },
    ],
  },
]

export const initialCardphotoToolbarState: CardphotoToolbarState =
  Object.fromEntries(flattenIcons(CARDPHOTO_TOOLBAR)) as CardphotoToolbarState

export interface CardphotoSectionConfig extends BaseSectionConfig<
  CardphotoToolbarState,
  CardphotoKey,
  'cardphoto'
> {}
