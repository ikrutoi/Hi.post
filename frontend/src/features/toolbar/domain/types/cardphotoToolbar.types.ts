import type { IconKey, IconState } from '@shared/config/constants'

export const CARDPHOTO_KEYS = [
  'download',
  'save',
  'delete',
  'turn',
  'fillFrame',
  'crop',
] as const satisfies readonly IconKey[]

export type CardphotoToolbarKey = (typeof CARDPHOTO_KEYS)[number]

export type CardphotoToolbarState = Record<CardphotoToolbarKey, IconState>

export const initialCardphotoToolbarState: CardphotoToolbarState = {
  download: 'enabled',
  save: 'disabled',
  delete: 'disabled',
  turn: 'enabled',
  fillFrame: 'disabled',
  crop: 'enabled',
}
