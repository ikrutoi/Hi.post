import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import type { ToolbarSection, ToolbarState } from '../../domain/types'

const selectToolbarBase = (state: RootState) => state.toolbar

export const selectToolbarSectionState = <S extends ToolbarSection>(
  section: S
) =>
  createSelector(
    [selectToolbarBase],
    (toolbar): ToolbarState[S] => toolbar[section]
  )

export const selectToolbarIconState = <
  S extends ToolbarSection,
  K extends keyof ToolbarState[S],
>(
  section: S,
  key: K
) => createSelector([selectToolbarBase], (toolbar) => toolbar[section][key])
