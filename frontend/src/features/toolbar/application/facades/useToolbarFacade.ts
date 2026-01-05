import { useSelector } from 'react-redux'
import type { ReactEditor } from 'slate-react'
import type { RootState } from '@app/state'
import { TOOLBAR_CONFIG } from '../../domain/config'
import {
  selectToolbarSectionState,
  selectCardphotoOrientationIcon,
} from '../../infrastructure/selectors'
import {
  updateToolbarSection,
  updateToolbarIcon,
} from '../../infrastructure/state'
import { toolbarController } from '../controllers'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toolbarAction } from '../helpers'
import { selectCardOrientation } from '@layout/infrastructure/selectors'
import type {
  ToolbarSection,
  ToolbarState,
  ToolbarKeyFor,
} from '../../domain/types'
import type { LayoutOrientation } from '@layout/domain/types'
import type { IconState } from '@shared/config/constants'

export function useToolbarFacade<S extends ToolbarSection>(section: S) {
  const dispatch = useAppDispatch()

  const state = useSelector((root: RootState) =>
    selectToolbarSectionState(section)(root)
  ) as ToolbarState[S]

  const config = TOOLBAR_CONFIG[section]
  const badges = (TOOLBAR_CONFIG[section] as any).getBadges?.(state) ?? {}

  const onAction = (key: ToolbarKeyFor<S>, editor?: ReactEditor) => {
    dispatch(toolbarAction({ section, key }))
    toolbarController.onAction(section, key, editor, dispatch)
  }

  const updateCurrent = (value: Partial<ToolbarState[S]>) => {
    dispatch(updateToolbarSection({ section, value }))
  }

  const orientation: LayoutOrientation | undefined =
    section === 'cardphoto' ? useAppSelector(selectCardOrientation) : undefined

  const orientationIconState: IconState | undefined =
    section === 'cardphoto'
      ? useAppSelector(selectCardphotoOrientationIcon)
      : undefined

  const setOrientationIcon = (value: IconState) => {
    if (section === 'cardphoto') {
      dispatch(
        updateToolbarIcon({
          section: 'cardphoto',
          key: 'cardOrientation',
          value,
        })
      )
    }
  }

  return {
    state,
    config,
    badges,
    onAction,
    actions: { updateCurrent, setOrientationIcon },
    extra: {
      orientation,
      orientationIconState,
    },
  }
}
