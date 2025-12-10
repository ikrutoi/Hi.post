import type { IconState } from '@shared/config/constants'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'
import { flattenIcons } from '../helpers'

export const CARDPHOTO_TOOLBAR: ToolbarConfig = [
  {
    group: 'photo',
    icons: [
      { key: 'download', state: 'enabled' },
      { key: 'save', state: 'disabled' },
      { key: 'delete', state: 'disabled' },
      { key: 'turn', state: 'enabled' },
      { key: 'fillFrame', state: 'disabled' },
      { key: 'crop', state: 'enabled' },
    ],
  },
]

export const CARDPHOTO_KEYS = [
  'download',
  'save',
  'delete',
  'turn',
  'fillFrame',
  'crop',
] as const

export type CardphotoKey = (typeof CARDPHOTO_KEYS)[number]

export type CardphotoToolbarState = Record<CardphotoKey, IconState>

export const initialCardphotoToolbarState: CardphotoToolbarState =
  Object.fromEntries(flattenIcons(CARDPHOTO_TOOLBAR)) as CardphotoToolbarState

export interface CardphotoSectionConfig
  extends BaseSectionConfig<CardphotoToolbarState, CardphotoKey, 'cardphoto'> {}
