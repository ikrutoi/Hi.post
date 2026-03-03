import { useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useAddressBookList } from '../../addressBook/application/controllers'
import { useAddressTemplateActions } from '@entities/templates'
import { closeSenderListPanel } from '../../infrastructure/state'
import { toggleSenderSortDirection } from '../../sender/infrastructure/state'
import {
  addAddressTemplateRef,
  removeAddressTemplateRef,
  incrementAddressTemplatesReloadVersion,
  incrementAddressBookReloadVersion,
} from '@features/previewStrip/infrastructure/state'
import { removeAddressBookEntry } from '../../addressBook/infrastructure/state'

export const useSenderListPanelFacade = () => {
  const dispatch = useAppDispatch()
  const { entries, sortOptions } = useAddressBookList('sender')
  const { delete: deleteTemplate } = useAddressTemplateActions('sender')

  const addressTemplateRefs = useAppSelector(
    (state) => state.previewStripOrder?.addressTemplateRefs ?? [],
  )

  const starredSenderIds = useMemo(
    () =>
      new Set(
        addressTemplateRefs
          .filter((r) => r.type === 'sender')
          .map((r) => r.id),
      ),
    [addressTemplateRefs],
  )

  useEffect(() => {
    dispatch(incrementAddressBookReloadVersion())
  }, [dispatch])

  const closePanel = useCallback(() => {
    dispatch(closeSenderListPanel())
  }, [dispatch])

  const toggleSortDirection = useCallback(() => {
    dispatch(toggleSenderSortDirection())
  }, [dispatch])

  const handleToggleStar = useCallback(
    (id: string, currentlyStarred: boolean) => {
      if (currentlyStarred) {
        dispatch(removeAddressTemplateRef({ type: 'sender', id }))
      } else {
        dispatch(addAddressTemplateRef({ type: 'sender', id }))
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
          dispatch(removeAddressTemplateRef({ type: 'sender', id }))
          dispatch(removeAddressBookEntry({ id, role: 'sender' }))
          dispatch(incrementAddressTemplatesReloadVersion())
          onDeleted?.(id)
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            'Failed to delete sender address template:',
            result.error,
          )
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to delete sender address template:', e)
      }
    },
    [deleteTemplate, dispatch],
  )

  return {
    entries,
    sortOptions,
    starredSenderIds,
    closePanel,
    toggleSortDirection,
    handleToggleStar,
    handleDeleteEntry,
  }
}
