import React, { useCallback, useMemo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectRecipientApplied,
  selectRecipientEntriesState,
  selectRecipientState,
  selectRecipientViewId,
} from '@envelope/recipient/infrastructure/selectors'
import {
  setRecipientViewId,
} from '@envelope/recipient/infrastructure/state'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import type { AddressFields } from '@shared/config/constants'
import navStyles from '@date/dateHeader/presentation/MobileDateCalendarToolbarSlider.module.scss'
import styles from './RecipientsBrowseToolbar.module.scss'

function resolveRecipientAddress(
  id: string,
  entries: { id: string; address?: AddressFields }[],
  envelopeRows: {
    recipientViewId: string | null
    viewDraft?: AddressFields
    appliedData?: AddressFields | null
  }[],
): AddressFields | null {
  const entry = entries.find((e) => e.id === id)
  if (entry?.address) return { ...entry.address }

  const row = envelopeRows.find((r) => r.recipientViewId === id)
  if (row?.appliedData != null) {
    const hasFields = Object.values(row.appliedData).some(
      (v) => (v ?? '').toString().trim() !== '',
    )
    if (hasFields) return { ...row.appliedData }
  }
  if (row?.viewDraft != null) {
    const hasFields = Object.values(row.viewDraft).some(
      (v) => (v ?? '').toString().trim() !== '',
    )
    if (hasFields) return { ...row.viewDraft }
  }
  return null
}

/**
 * Envelope complete-band chrome: arrows + current recipient name.
 */
export const RecipientsBrowseToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const appliedIds = useAppSelector(selectRecipientApplied)
  const recipient = useAppSelector(selectRecipientState)
  const recipientViewId = useAppSelector(selectRecipientViewId)
  const entries = useAppSelector(selectRecipientEntriesState)
  const envelopeRows = useAppSelector(selectRecipientsList)

  const ids = useMemo(() => {
    if (appliedIds.length > 0) return appliedIds
    const first = recipient?.recipientsViewIdsFirstList ?? []
    const second = recipient?.recipientsViewIdsSecondList ?? []
    return recipient?.currentRecipientsList === 'second' ? second : first
  }, [appliedIds, recipient])

  const count = ids.length
  const maxIndex = Math.max(0, count - 1)

  const index = useMemo(() => {
    if (count === 0) return 0
    if (recipientViewId == null) return 0
    const at = ids.indexOf(recipientViewId)
    return at >= 0 ? at : 0
  }, [count, ids, recipientViewId])

  const currentId = ids[index] ?? null
  const currentName = useMemo(() => {
    if (currentId == null) return ''
    const address = resolveRecipientAddress(currentId, entries, envelopeRows)
    return (address?.name ?? '').trim()
  }, [currentId, entries, envelopeRows])

  const selectIndex = useCallback(
    (next: number) => {
      if (count <= 0) return
      const clamped = Math.min(maxIndex, Math.max(0, next))
      const id = ids[clamped]
      if (id == null) return
      // Browse cursor only — do not overwrite session appliedData (shared by plan pies / cart).
      dispatch(setRecipientViewId(id))
    },
    [count, dispatch, ids, maxIndex],
  )

  const handleDecrement = useCallback(() => {
    selectIndex(index - 1)
  }, [index, selectIndex])

  const handleIncrement = useCallback(() => {
    selectIndex(index + 1)
  }, [index, selectIndex])

  if (count <= 1) return null

  return (
    <div className={navStyles.root}>
      <button
        type="button"
        className={navStyles.navArrow}
        onClick={handleDecrement}
        aria-label="Previous recipient"
        disabled={index <= 0}
      >
        <FaChevronLeft className={navStyles.navArrowIcon} />
      </button>

      <div className={navStyles.sliderWrap}>
        <p
          className={styles.recipientName}
          title={currentName || undefined}
          aria-label={
            currentName
              ? `Recipient ${index + 1} of ${count}: ${currentName}`
              : `Recipient ${index + 1} of ${count}`
          }
        >
          {currentName || '—'}
        </p>
      </div>

      <button
        type="button"
        className={navStyles.navArrow}
        onClick={handleIncrement}
        aria-label="Next recipient"
        disabled={index >= maxIndex}
      >
        <FaChevronRight className={navStyles.navArrowIcon} />
      </button>
    </div>
  )
}
