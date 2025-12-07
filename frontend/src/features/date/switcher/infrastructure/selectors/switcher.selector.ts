import { RootState } from '@app/state'
import type { SwitcherState } from '../../domain/types'

export const selectSwitcher = (state: RootState): SwitcherState =>
  state.switcher
export const selectSwitcherPosition = (state: RootState) =>
  state.switcher.position
