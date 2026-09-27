import React from 'react'
import clsx from 'clsx'
import { postcardKeepsSeal, type PostcardStatus } from '@entities/postcard'
import type { DispatchDate } from '@entities/date/domain/types'
import { useAppSelector } from '@app/hooks'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { selectDraftDispatchDates } from '@date/infrastructure/selectors'
import { firstDispatchDate } from '@envelope/presentation/sealNoOutlineSvg'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { useMarkStampYearCount } from '@envelope/application/hooks/useMarkStampYearCount'
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
  const { listRowLocalId } = useRightListArchiveMini()
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
        <MarkStampComposite yearCount={yearCount} />
        {sealDate != null ? (
          <EnvelopeSeal pose={storedSeal} date={sealDate} />
        ) : null}
      </div>
    </div>
  )
}
