import { CardtextToolbarState } from './cardtextToolbar.types'
import { EnvelopeToolbarState } from './envelopeToolbar.types'
import type { CardphotoToolbarState } from './cardphotoToolbar.types'
import type {
  CardphotoToolbarKey,
  CardtextToolbarKey,
  EnvelopeToolbarKey,
} from '../types'

export type ToolbarState = {
  cardphoto: CardphotoToolbarState
  cardtext: CardtextToolbarState
  envelope: EnvelopeToolbarState
}

export type ToolbarKey =
  | CardphotoToolbarKey
  | CardtextToolbarKey
  | EnvelopeToolbarKey
