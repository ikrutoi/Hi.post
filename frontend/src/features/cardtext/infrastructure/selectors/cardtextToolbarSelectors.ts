import { RootState } from '@app/state'
import type { CardtextToolbarState, CardtextKey } from '@toolbar/domain/types'

export const selectCardtextToolbarState = (
  state: RootState
): CardtextToolbarState => state.cardtextToolbar

export const selectCardtextIconState =
  (key: CardtextKey) => (state: RootState) =>
    state.cardtextToolbar[key]

export const selectIsCardtextIconActive =
  (key: CardtextKey) => (state: RootState) =>
    state.cardtextToolbar[key] === 'active'

export const selectIsCardtextIconEnabled =
  (key: CardtextKey) => (state: RootState) => {
    const value = state.cardtextToolbar[key]
    return value === 'enabled' || value === 'active'
  }
