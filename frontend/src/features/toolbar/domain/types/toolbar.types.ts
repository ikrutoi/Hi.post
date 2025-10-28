import { CardtextToolbarState } from './cardtextToolbar.types'
import { EnvelopeToolbarState } from './envelopeToolbar.types'
import type { CardphotoToolbarState } from './cardphotoToolbar.types'
import type {
  CardphotoToolbarKey,
  CardtextToolbarKey,
  EnvelopeToolbarKey,
} from '../types'

export const TOOLBAR_SECTIONS = ['cardphoto', 'cardtext', 'envelope'] as const

export type ToolbarSection = (typeof TOOLBAR_SECTIONS)[number]

export type ToolbarState = {
  cardphoto: CardphotoToolbarState
  cardtext: CardtextToolbarState
  envelope: EnvelopeToolbarState
}

export type ToolbarKey =
  | CardphotoToolbarKey
  | CardtextToolbarKey
  | EnvelopeToolbarKey
