import { buildCardtextToolbarState } from '../helpers'
import { initialCardtextValue } from '../editor/editor.types'
import type { CardtextToolbarState } from '@toolbar/domain/types'

export const initialCardtextToolbarState: CardtextToolbarState =
  buildCardtextToolbarState(initialCardtextValue)
