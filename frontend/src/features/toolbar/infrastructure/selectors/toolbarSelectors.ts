import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import type { IconState, IconStateGroup } from '@shared/config/constants'
import type {
  ToolbarSection,
  ToolbarState,
  ToolbarGroup,
} from '../../domain/types'

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

export const selectCardphotoOrientationIcon = createSelector(
  [selectToolbarBase],
  (toolbar): IconState => toolbar.cardphoto?.cardOrientation ?? 'enabled'
)

export const selectToolbarGroups = <S extends ToolbarSection>(section: S) =>
  createSelector(
    [selectToolbarBase],
    (toolbar): ToolbarGroup[] => toolbar[section].config
  )

export const selectToolbarGroupStatus = <S extends ToolbarSection>(
  section: S,
  groupName: string
) =>
  createSelector([selectToolbarGroups(section)], (groups): IconStateGroup => {
    const group = groups.find((g) => g.group === groupName)
    return group?.status || 'enabled'
  })
