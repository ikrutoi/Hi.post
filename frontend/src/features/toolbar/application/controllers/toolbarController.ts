import { useAppDispatch } from '@app/hooks'
import {
  updateGroupStatus,
  updateToolbarIcon,
  updateToolbarSection,
} from '../../infrastructure/state'
import { toolbarAction } from '../helpers'
import type { IconKey, IconStateGroup } from '@shared/config/constants'
import type { ToolbarSection } from '../../domain/types'

export const useToolbarController = (section: ToolbarSection) => {
  const dispatch = useAppDispatch()

  const onAction = (key: IconKey, payload?: any) => {
    dispatch(toolbarAction({ section, key, payload }))
  }

  const setGroupStatus = (groupName: string, status: IconStateGroup) => {
    console.log('setGroup Controller')
    dispatch(updateGroupStatus({ section, groupName, status }))
  }

  const setIconState = (key: IconKey, value: any) => {
    dispatch(updateToolbarIcon({ section, key, value }))
  }

  const updateSection = (value: any) => {
    dispatch(updateToolbarSection({ section, value }))
  }

  return {
    onAction,
    setGroupStatus,
    setIconState,
    updateSection,
  }
}
