import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { formatAddressPreviewLines } from '@envelope/addressBook/presentation/addressSummaryLines'
import type { AddressPreviewLine } from '@envelope/addressBook/presentation/addressSummaryLines'
import { listStatusIsInQuickAddressBook } from '@envelope/domain/helpers'
import {
  clearRecipientsFormPreviewId,
} from '@envelope/infrastructure/state'
import {
  selectRecipientListPanelOpen,
  selectRecipientListPendingIds,
  selectRecipientsFormPreviewId,
  selectSenderListPanelOpen,
  selectSenderSelectedId,
} from '@envelope/infrastructure/selectors'
import {
  selectRecipientEntriesState,
  selectRecipientView,
} from '@envelope/recipient/infrastructure/selectors'
import { selectSenderEntriesState } from '@envelope/sender/infrastructure/selectors'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'

export type AddressCardPiePreviewModel = {
  role: 'sender' | 'recipient'
  source: 'list' | 'form'
  id: string
  address: AddressBookEntry['address']
  lines: AddressPreviewLine[]
  inQuickList: boolean
}

function toPreview(
  entry: AddressBookEntry,
  role: 'sender' | 'recipient',
  source: 'list' | 'form',
): AddressCardPiePreviewModel {
  return {
    role,
    source,
    id: entry.id,
    address: entry.address,
    lines: formatAddressPreviewLines(entry),
    inQuickList: listStatusIsInQuickAddressBook(entry.listStatus),
  }
}

/** Selected address-book / recipients-grid template → central CardPie preview. */
export function useAddressCardPiePreview() {
  const dispatch = useAppDispatch()
  const activeSection = useAppSelector(selectActiveSection)
  const senderListPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const recipientListPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const senderSelectedId = useAppSelector(selectSenderSelectedId)
  const recipientListPendingIds = useAppSelector(selectRecipientListPendingIds)
  const recipientsFormPreviewId = useAppSelector(selectRecipientsFormPreviewId)
  const recipientView = useAppSelector(selectRecipientView)
  const senderEntries = useAppSelector(selectSenderEntriesState)
  const recipientEntries = useAppSelector(selectRecipientEntriesState)

  const listChromeActive =
    activeSection === 'envelope' &&
    (senderListPanelOpen || recipientListPanelOpen)

  useEffect(() => {
    if (activeSection === 'envelope') return
    if (recipientsFormPreviewId == null) return
    dispatch(clearRecipientsFormPreviewId())
  }, [activeSection, dispatch, recipientsFormPreviewId])

  const listPreview = useMemo((): AddressCardPiePreviewModel | null => {
    if (!listChromeActive) return null

    if (senderListPanelOpen && senderSelectedId) {
      const entry = senderEntries.find((e) => e.id === senderSelectedId)
      if (!entry) return null
      return toPreview(entry, 'sender', 'list')
    }

    if (recipientListPanelOpen && recipientListPendingIds.length > 0) {
      const lastId =
        recipientListPendingIds[recipientListPendingIds.length - 1]
      const entry = recipientEntries.find((e) => e.id === lastId)
      if (!entry) return null
      return toPreview(entry, 'recipient', 'list')
    }

    return null
  }, [
    listChromeActive,
    senderListPanelOpen,
    senderSelectedId,
    senderEntries,
    recipientListPanelOpen,
    recipientListPendingIds,
    recipientEntries,
  ])

  const formPreview = useMemo((): AddressCardPiePreviewModel | null => {
    if (activeSection !== 'envelope') return null
    if (listChromeActive) return null
    if (
      recipientView === 'recipientView' ||
      recipientView === 'recipientCreate'
    ) {
      return null
    }
    if (recipientsFormPreviewId == null) return null
    const entry = recipientEntries.find((e) => e.id === recipientsFormPreviewId)
    if (!entry) return null
    return toPreview(entry, 'recipient', 'form')
  }, [
    activeSection,
    listChromeActive,
    recipientView,
    recipientsFormPreviewId,
    recipientEntries,
  ])

  const preview = listPreview ?? formPreview
  const showSurface = listChromeActive || formPreview != null

  return {
    listChromeActive,
    preview,
    showSurface,
  }
}
