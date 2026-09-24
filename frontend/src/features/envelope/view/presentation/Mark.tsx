import React from 'react'
import clsx from 'clsx'
import type { PostcardStatus } from '@entities/postcard'
import { useAppSelector } from '@app/hooks'
import { selectAromaDisplayAroma } from '@aroma/infrastructure/selectors'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { useMarkStampYearCount } from '@envelope/application/hooks/useMarkStampYearCount'
import { stampAroma99ColorsForSlot } from '@envelope/domain/stampAroma99Colors'
import { MarkStampComposite } from './MarkStampComposite'
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
  const { listRowInner, rightPieEnvelopePeekNoToolbar } =
    useRightListArchiveMini()
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
      >
        <MarkStampComposite
          variant={isReadyStamp ? 'ready' : 'cart'}
          aromaColors={stampAroma99ColorsForSlot(aromaSlot)}
          yearCount={yearCount}
        />
      </div>
    </div>
  )
}
