import React, { useMemo } from 'react'
import styles from './SectionPresets.module.scss'
import type { Template } from '@shared/config/constants'
import { trimLines } from '../application/helpers/trimLines'
import shotMonths from '@data/date/monthsShotOfYear.json'
import type { SectionPresetRow } from '../application/helpers/sectionPresetRow'
import { isMemoryPresetRow, sectionPresetRowId } from '../application/helpers/sectionPresetRow'

interface Props {
  card: SectionPresetRow
  index: number
  section: Template
  size: { width: number; height: number }
  remSize: number
  refs: {
    cardRef: (el: HTMLElement | null) => void
    filterRef?: (el: HTMLElement | null) => void
    spanNameRef?: (el: HTMLElement | null) => void
  }
  onClick: (id: string) => void
}

function cardphotoPreviewSrc(
  card: SectionPresetRow
): { src: string; revoke?: () => void } | null {
  if (!isMemoryPresetRow(card)) return null
  const meta =
    card.card.cardphoto.assetData ?? card.card.cardphoto.appliedData
  if (!meta) return null
  const blob = meta.full?.blob ?? meta.thumbnail?.blob
  if (blob) {
    const url = URL.createObjectURL(blob)
    return { src: url, revoke: () => URL.revokeObjectURL(url) }
  }
  const url = meta.thumbnail?.url ?? meta.full?.url ?? meta.url
  if (url) return { src: url }
  return null
}

export const PresetCard: React.FC<Props> = ({
  card,
  index,
  section,
  size,
  remSize,
  refs,
  onClick,
}) => {
  const source = ['cart', 'drafts']
  const id = sectionPresetRowId(card)
  const inner = isMemoryPresetRow(card) ? card.card : null

  const photoPreview = useMemo(() => cardphotoPreviewSrc(card), [card])

  React.useEffect(() => {
    return () => photoPreview?.revoke?.()
  }, [photoPreview])

  const recipientDisplayName =
    inner?.envelope.recipient.appliedData?.name ??
    inner?.envelope.recipient.viewDraft?.name ??
    ''

  const dispatchDate = inner?.date
  const showCartDate =
    section === 'cart' &&
    dispatchDate != null &&
    dispatchDate.year > 0 &&
    dispatchDate.month > 0

  return (
    <div
      className={`${styles['section-presets__card']} ${styles[`section-presets__card--${section}`]}`}
      ref={refs.cardRef}
      data-id={id}
      data-index={index}
      data-personal-id={id}
      style={{ width: size.width, height: size.height }}
      onClick={() => onClick(String(id))}
    >
      {source.includes(section) && inner && (
        <>
          <div
            className={styles['section-presets__filter']}
            ref={refs.filterRef}
            data-id={id}
          />
          {section === 'cardphoto' && photoPreview && (
            <img
              className={styles['section-presets__photo']}
              src={photoPreview.src}
              alt="memoryCardPhoto"
              style={{ width: size.width, height: size.height }}
            />
          )}
          {showCartDate && (
            <span className={styles['section-presets__date-container']}>
              <span className={styles['section-presets__date']}>
                {dispatchDate.year}
              </span>
              <span className={styles['section-presets__date']}>
                {'\xA0'}
                {shotMonths[dispatchDate.month - 1] ?? ''}
                {'\xA0'}
              </span>
              <span className={styles['section-presets__date']}>
                {dispatchDate.day}
              </span>
            </span>
          )}
          <span
            className={`${styles['section-presets__name']} ${styles[`section-presets__name--${section}`]}`}
          >
            {section === 'recipient' &&
              inner.envelope.isComplete &&
              trimLines(section, recipientDisplayName)}
          </span>
        </>
      )}
    </div>
  )
}
