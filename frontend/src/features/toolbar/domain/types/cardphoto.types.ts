import { flattenIcons } from '../helpers'
import type { IconState } from '@shared/config/constants'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const CARDPHOTO_KEYS = [
  'turn',
  'fillFrame',
  'crop',
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
      { key: 'turn', state: 'disabled' },
      { key: 'fillFrame', state: 'disabled' },
      { key: 'crop', state: 'enabled' },
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
