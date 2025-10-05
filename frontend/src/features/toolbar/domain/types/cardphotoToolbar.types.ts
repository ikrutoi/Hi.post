import type { State } from '@shared/config/theme'

export const CARDPHOTO_KEYS = [
  'download',
  'save',
  'delete',
  'turn',
  'fillFrame',
  'crop',
] as const

export type CardphotoToolbarKey = (typeof CARDPHOTO_KEYS)[number]

export type CardphotoToolbarState = {
  download: State
  save: State
  delete: State
  turn: State
  fillFrame: State
  crop: State
}

export const initialCardphotoToolbarState: CardphotoToolbarState = {
  download: 'enabled',
  save: 'disabled',
  delete: 'disabled',
  turn: 'enabled',
  fillFrame: 'disabled',
  crop: 'enabled',
}
