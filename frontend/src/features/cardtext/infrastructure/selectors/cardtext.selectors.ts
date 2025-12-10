import { RootState } from '@app/state'
import { CardtextKey } from '@toolbar/domain/types'

export const selectCardtextState = (state: RootState) => state.cardtext

export const selectCardtextValue = (state: RootState) => state.cardtext.value

export const selectCardtextToolbar = (state: RootState) =>
  state.cardtext.toolbar

export const selectToolbarIconState =
  (key: CardtextKey) => (state: RootState) =>
    state.cardtext.toolbar[key]
