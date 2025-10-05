import type { State } from '@shared/config/theme'

export const CARDTEXT_KEYS = [
  'italic',
  'fontSize',
  'color',
  'left',
  'center',
  'right',
  'justify',
  'save',
  'delete',
  'clip',
] as const

export type CardtextToolbarKey = (typeof CARDTEXT_KEYS)[number]

export type CardtextToolbarState = {
  italic: State
  fontSize: State
  color: State
  left: State
  center: State
  right: State
  justify: State
  save: State
  delete: State
  clip: State
}

export const initialCardtextToolbarState: CardtextToolbarState = {
  italic: 'enabled',
  fontSize: 'enabled',
  color: 'enabled',
  left: 'enabled',
  center: 'enabled',
  right: 'enabled',
  justify: 'enabled',
  save: 'disabled',
  delete: 'disabled',
  clip: 'disabled',
}
