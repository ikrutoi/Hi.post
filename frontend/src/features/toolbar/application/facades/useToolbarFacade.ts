import { useSelector } from 'react-redux'
import type { ReactEditor } from 'slate-react'
import { TOOLBAR_CONFIG } from '../../domain/config'
import {
  selectToolbarSectionState,
  selectToolbarGroups,
} from '../../infrastructure/selectors'
import { useToolbarController } from '../controllers'
import type { ToolbarSection, ToolbarKeyFor } from '../../domain/types'
import type { IconKey } from '@shared/config/constants'

export function useToolbarFacade<S extends ToolbarSection>(section: S) {
  const { onAction, setGroupStatus, setIconState, updateSection } =
    useToolbarController(section)

  const state = useSelector(selectToolbarSectionState(section))
  const groups = useSelector(selectToolbarGroups(section))

  const config = TOOLBAR_CONFIG[section]
  const badges = (config as any).getBadges?.(state) ?? {}

  const handleAction = (key: IconKey, editor?: ReactEditor) => {
    onAction(key as ToolbarKeyFor<S>, editor)
  }

  return {
    state: {
      state,
      groups,
      config,
      badges,
    },
    actions: {
      onAction: handleAction,
      setGroupStatus,
      setIconState,
      updateSection,
    },

    extra: {
      orientation: (state as any).orientation,
    },
  }
}
