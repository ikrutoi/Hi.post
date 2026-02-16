import { useSelector } from 'react-redux'
import type { ReactEditor } from 'slate-react'
import { TOOLBAR_CONFIG } from '../../domain/config'
import {
  selectToolbarSectionState,
  selectToolbarGroups,
} from '../../infrastructure/selectors'
import { useToolbarController } from '../controllers'
import type {
  ToolbarSection,
  ToolbarKeyFor,
  ToolbarSectionConfigMap,
} from '../../domain/types'
import type { IconKey } from '@shared/config/constants'

export function useToolbarFacade<S extends ToolbarSection>(section: S) {
  const { onAction, setGroupStatus, setIconState, updateSection } =
    useToolbarController(section)

  const state = useSelector(selectToolbarSectionState(section))
  const groups = useSelector(selectToolbarGroups(section))
  const businessState = useSelector((state: any) => state[section]?.state)

  const config = TOOLBAR_CONFIG[section] as ToolbarSectionConfigMap[S]
  const badges = config.getBadges?.({ ...state, ...businessState }) ?? {}

  const handleAction = (key: IconKey, editor?: ReactEditor) => {
    onAction(key as ToolbarKeyFor<S>, editor)
  }

  return {
    state,
    groups,
    config,
    badges,
    // state: {
    //   state,
    //   groups,
    //   config,
    //   badges,
    // },
    actions: {
      onAction: handleAction,
      setGroupStatus,
      setIconState,
      updateSection,
    },

    extra: {
      orientation: 'orientation' in state ? (state as any).orientation : null,
    },
  }
}
