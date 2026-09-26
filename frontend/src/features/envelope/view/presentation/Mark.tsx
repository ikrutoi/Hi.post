import React from 'react'
import clsx from 'clsx'
import { postcardKeepsSeal, type PostcardStatus } from '@entities/postcard'
import type { DispatchDate } from '@entities/date/domain/types'
import { useAppSelector } from '@app/hooks'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { selectDraftDispatchDates } from '@date/infrastructure/selectors'
import { firstDispatchDate } from '@envelope/presentation/sealNoOutlineSvg'
import { selectAromaDisplayAroma } from '@aroma/infrastructure/selectors'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { useMarkStampYearCount } from '@envelope/application/hooks/useMarkStampYearCount'
import { stampAroma99ColorsForSlot } from '@envelope/domain/stampAroma99Colors'
import { MarkStampComposite } from './MarkStampComposite'
import { EnvelopeSeal } from '@envelope/presentation/EnvelopeSeal'
import styles from './Mark.module.scss'

export type MarkProps = {
  simplifiedPeek?: boolean
  listArchivePostcardStatus?: PostcardStatus
}

function stampClassForArchiveStatus(
  status: PostcardStatus | undefined,
): typeof styles.markStampPeekCart | typeof styles.markStampPeekReady {
  if (status === 'ready' || status === 'sent' || status === 'delivered') {
    return styles.markStampPeekReady
  }
  return styles.markStampPeekCart
}

export const Mark: React.FC<MarkProps> = ({
  simplifiedPeek,
  listArchivePostcardStatus,
}) => {
  const yearCount = useMarkStampYearCount(Boolean(simplifiedPeek))
  const displayAroma = useAppSelector(selectAromaDisplayAroma)
  const { listRowInner, listRowLocalId, rightPieEnvelopePeekNoToolbar } =
    useRightListArchiveMini()
  const postcards = useAppSelector(selectCartItems)
  const draftDates = useAppSelector(selectDraftDispatchDates)
  const storedPostcard =
    simplifiedPeek &&
    listArchivePostcardStatus != null &&
    postcardKeepsSeal(listArchivePostcardStatus)
      ? (postcards.find((item) => item.localId === listRowLocalId) ?? null)
      : null
  const storedSeal = storedPostcard?.seal ?? null
  const sealDate: DispatchDate | null = storedPostcard
    ? storedPostcard.date
    : simplifiedPeek
      ? null
      : firstDispatchDate(draftDates)
  const aromaSlot =
    simplifiedPeek && rightPieEnvelopePeekNoToolbar
      ? (listRowInner?.aroma?.index ?? null)
      : (displayAroma?.index ?? null)
  const isReadyStamp =
    simplifiedPeek &&
    (listArchivePostcardStatus === 'ready' ||
      listArchivePostcardStatus === 'sent' ||
      listArchivePostcardStatus === 'delivered')

  return (
    <div className={styles.mark}>
      <div
        className={clsx(
          styles.markStamp,
          isReadyStamp
            ? styles.markStampPeekReady
            : simplifiedPeek
              ? stampClassForArchiveStatus(listArchivePostcardStatus)
              : styles.markStampNotActive,
        )}
        data-envelope-stamp
      >
        <MarkStampComposite
          variant={isReadyStamp ? 'ready' : 'cart'}
          aromaColors={stampAroma99ColorsForSlot(aromaSlot)}
          yearCount={yearCount}
        />
        {sealDate != null ? (
          <EnvelopeSeal pose={storedSeal} date={sealDate} />
        ) : null}
      </div>
    </div>
  )
}
