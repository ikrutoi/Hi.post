import { useSelector } from 'react-redux'
import type { ReactEditor } from 'slate-react'
import type { RootState } from '@app/state'
import { TOOLBAR_CONFIG } from '../../domain/config'
import { selectToolbarSectionState } from '../../infrastructure/selectors'
import { updateToolbarSection } from '../../infrastructure/state'
import { toolbarController } from '../controllers'
import { useAppDispatch } from '@/app/hooks'
import { toolbarAction } from '../helpers'
import type {
  ToolbarSection,
  ToolbarState,
  ToolbarKeyFor,
} from '../../domain/types'

export function useToolbarFacade<S extends ToolbarSection>(section: S) {
  const state = useSelector((root: RootState) =>
    selectToolbarSectionState(section)(root)
  ) as ToolbarState[S]

  const dispatch = useAppDispatch()
  const config = TOOLBAR_CONFIG[section]

  const badges = (TOOLBAR_CONFIG[section] as any).getBadges?.(state) ?? {}

  const onAction = (key: ToolbarKeyFor<S>, editor: ReactEditor) => {
    dispatch(toolbarAction({ section, key }))
    toolbarController.onAction(section, key, editor, dispatch)
  }

  const updateCurrent = (value: Partial<ToolbarState[S]>) => {
    dispatch(updateToolbarSection({ section, value }))
  }

  return {
    state,
    config,
    badges,
    onAction,
    actions: { updateCurrent },
  }
}
