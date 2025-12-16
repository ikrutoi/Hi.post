import { RootState } from '@app/state'
import type { ToolbarSection, ToolbarState } from '../../domain/types'

export const selectToolbarSectionState =
  <S extends ToolbarSection>(section: S) =>
  (state: RootState): ToolbarState[S] =>
    state.toolbar[section]

export const selectToolbarIconState =
  <S extends ToolbarSection>(section: S, key: keyof ToolbarState[S]) =>
  (state: RootState) =>
    state.toolbar[section][key]
