import { useAppDispatch } from '@app/hooks'
import {
  updateGroupStatus,
  updateToolbarIcon,
  updateToolbarSection,
} from '../../infrastructure/state'
import { toolbarAction } from '../helpers'
import { saveAddressRequested as recipientSaveAddressRequested } from '@envelope/recipient/infrastructure/state'
import { saveAddressRequested as senderSaveAddressRequested } from '@envelope/sender/infrastructure/state'
import type { IconKey, IconStateGroup } from '@shared/config/constants'
import type { ToolbarSection } from '../../domain/types'

export const useToolbarController = (section: ToolbarSection) => {
  const dispatch = useAppDispatch()

  const onAction = (key: IconKey, payload?: any) => {
    if (key === 'addressPlus' && (section === 'recipient' || section === 'sender')) {
      if (section === 'recipient') {
        dispatch(recipientSaveAddressRequested())
      } else {
        dispatch(senderSaveAddressRequested())
      }
    }
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
