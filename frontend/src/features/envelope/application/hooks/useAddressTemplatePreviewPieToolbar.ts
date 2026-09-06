import { useCallback } from 'react'
import { useAppDispatch } from '@app/hooks'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  clearAddressListPreviewSnapshot,
  closeAddressList,
} from '@envelope/infrastructure/state'
import {
  setRecipientViewDraft,
  setRecipientViewId,
} from '@envelope/recipient/infrastructure/state'
import { setSenderViewId } from '@envelope/sender/infrastructure/state'
import type { AddressFields, IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import type { AddressCardPiePreviewModel } from './useAddressCardPiePreview'

const ADDRESS_TEMPLATE_PREVIEW_PIE_TOOLBAR_INACTIVE: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'favorite', state: 'enabled' },
      { key: 'edit', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

const ADDRESS_TEMPLATE_PREVIEW_PIE_TOOLBAR_ACTIVE: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'favoriteFilled', state: 'active' },
      { key: 'edit', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

const ADDRESS_TEMPLATE_PREVIEW_PIE_STATE_INACTIVE = {
  favorite: { state: 'enabled' as const },
  edit: { state: 'enabled' as const },
}

const ADDRESS_TEMPLATE_PREVIEW_PIE_STATE_ACTIVE = {
  favoriteFilled: { state: 'active' as const },
  edit: { state: 'enabled' as const },
}

/** Star + edit beside the central CardPie address-template preview. */
export function useAddressTemplatePreviewPieToolbar(
  preview: AddressCardPiePreviewModel | null,
) {
  const dispatch = useAppDispatch()

  const onActionClick = useCallback(
    (key: IconKey) => {
      if (!preview) return
      if (key !== 'edit' && key !== 'favorite' && key !== 'favoriteFilled') {
        return
      }

      const section =
        preview.role === 'sender' ? 'senderView' : 'recipientView'

      if (preview.role === 'sender') {
        dispatch(setSenderViewId(preview.id))
      } else {
        dispatch(setRecipientViewId(preview.id))
        if (preview.source === 'form') {
          dispatch(setRecipientViewDraft(preview.address as AddressFields))
        }
      }

      if (key === 'edit') {
        if (preview.source === 'form') {
          dispatch(
            toolbarAction({
              section,
              key: 'edit',
              payload: { returnToFormPreview: true },
            }),
          )
          return false
        }
        dispatch(clearAddressListPreviewSnapshot())
        dispatch(closeAddressList())
        dispatch(
          toolbarAction({
            section,
            key: 'edit',
            payload: { returnToList: true },
          }),
        )
        return false
      }

      dispatch(
        toolbarAction({
          section,
          key: preview.inQuickList ? 'removeFromList' : 'addList',
        }),
      )
      return false
    },
    [dispatch, preview],
  )

  return {
    showToolbar: preview != null,
    groupsOverride: preview?.inQuickList
      ? ADDRESS_TEMPLATE_PREVIEW_PIE_TOOLBAR_ACTIVE
      : ADDRESS_TEMPLATE_PREVIEW_PIE_TOOLBAR_INACTIVE,
    stateOverride: preview?.inQuickList
      ? ADDRESS_TEMPLATE_PREVIEW_PIE_STATE_ACTIVE
      : ADDRESS_TEMPLATE_PREVIEW_PIE_STATE_INACTIVE,
    onActionClick,
  }
}
