import { buildCardtextToolbarState } from '../helpers'
import { initialCardtextValue } from './cardtext.types'
import type { CardtextToolbarState } from '@toolbar/domain/types'

export const initialCardtextToolbarState: CardtextToolbarState =
  buildCardtextToolbarState(initialCardtextValue)
