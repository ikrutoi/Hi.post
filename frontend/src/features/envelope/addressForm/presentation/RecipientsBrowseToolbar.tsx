import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectRecipientApplied,
  selectRecipientEntriesState,
  selectRecipientState,
  selectRecipientViewId,
} from '@envelope/recipient/infrastructure/selectors'
import {
  setRecipientAppliedData,
  setRecipientViewId,
} from '@envelope/recipient/infrastructure/state'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import type { AddressFields } from '@shared/config/constants'
import navStyles from '@date/dateHeader/presentation/MobileDateCalendarToolbarSlider.module.scss'
import sliderStyles from '@date/slider/presentation/Slider.module.scss'

function resolveRecipientAddress(
  id: string,
  entries: { id: string; address?: AddressFields }[],
  envelopeRows: { recipientViewId: string | null; viewDraft?: AddressFields; appliedData?: AddressFields | null }[],
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
 * Envelope complete-band chrome: same layout as calendar lower toolbar,
 * scale = number of applied recipient addresses.
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

  const selectIndex = useCallback(
    (next: number) => {
      if (count <= 0) return
      const clamped = Math.min(maxIndex, Math.max(0, next))
      const id = ids[clamped]
      if (id == null) return
      dispatch(setRecipientViewId(id))
      const address = resolveRecipientAddress(id, entries, envelopeRows)
      if (address != null) {
        dispatch(setRecipientAppliedData(address))
      }
    },
    [count, dispatch, entries, envelopeRows, ids, maxIndex],
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
        <div
          className={clsx(
            sliderStyles.sliderContainer,
            sliderStyles.sliderContainerToolbar,
          )}
        >
          <input
            type="range"
            className={clsx(
              sliderStyles.dateSliderLine,
              sliderStyles.dateSliderLineToolbar,
            )}
            min={0}
            max={maxIndex}
            step={1}
            value={index}
            aria-valuemin={1}
            aria-valuemax={count}
            aria-valuenow={index + 1}
            aria-label={`Recipient ${index + 1} of ${count}`}
            onChange={(e) => selectIndex(Number(e.target.value))}
          />
        </div>
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
