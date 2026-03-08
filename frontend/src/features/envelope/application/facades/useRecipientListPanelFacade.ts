import { useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useAddressBookList } from '../../addressBook/application/controllers'
import { useAddressTemplateActions } from '@entities/templates'
import { closeAddressList } from '../../infrastructure/state'
import { toggleRecipientSortDirection } from '../../recipient/infrastructure/state'
import {
  addAddressTemplateRef,
  removeAddressTemplateRef,
  incrementAddressTemplatesReloadVersion,
  incrementAddressBookReloadVersion,
} from '@features/previewStrip/infrastructure/state'
import { removeAddressBookEntry } from '../../addressBook/infrastructure/state'

export const useRecipientListPanelFacade = () => {
  const dispatch = useAppDispatch()
  const { entries, sortOptions } = useAddressBookList('recipient')
  const { delete: deleteTemplate } = useAddressTemplateActions('recipient')

  const addressTemplateRefs = useAppSelector(
    (state) => state.previewStripOrder?.addressTemplateRefs ?? [],
  )

  const starredRecipientIds = useMemo(
    () =>
      new Set(
        addressTemplateRefs
          .filter((r) => r.type === 'recipient')
          .map((r) => r.id),
      ),
    [addressTemplateRefs],
  )

  useEffect(() => {
    dispatch(incrementAddressBookReloadVersion())
  }, [dispatch])

  const closePanel = useCallback(() => {
    dispatch(closeAddressList())
  }, [dispatch])

  const toggleSortDirection = useCallback(() => {
    dispatch(toggleRecipientSortDirection())
  }, [dispatch])

  const handleToggleStar = useCallback(
    (id: string, currentlyStarred: boolean) => {
      if (currentlyStarred) {
        dispatch(removeAddressTemplateRef({ type: 'recipient', id }))
      } else {
        dispatch(addAddressTemplateRef({ type: 'recipient', id }))
        dispatch(incrementAddressTemplatesReloadVersion())
      }
    },
    [dispatch],
  )

  const handleDeleteEntry = useCallback(
    async (id: string, onDeleted?: (id: string) => void) => {
      try {
        const result = await deleteTemplate(id)
        if (result.success) {
          dispatch(removeAddressTemplateRef({ type: 'recipient', id }))
          dispatch(removeAddressBookEntry({ id, role: 'recipient' }))
          dispatch(incrementAddressTemplatesReloadVersion())
          onDeleted?.(id)
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            'Failed to delete recipient address template:',
            result.error,
          )
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to delete recipient address template:', e)
      }
    },
    [deleteTemplate, dispatch],
  )

  return {
    entries,
    sortOptions,
    starredRecipientIds,
    closePanel,
    toggleSortDirection,
    handleToggleStar,
    handleDeleteEntry,
  }
}
