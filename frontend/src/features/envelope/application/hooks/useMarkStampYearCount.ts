import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectDraftDispatchDates } from '@date/infrastructure/selectors'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { primaryDispatchDateFromPieInner } from '@features/cardPie/domain/primaryDispatchDateFromPieInner'
import { markStampYearCountFromDispatch } from '../../domain/markStampYearDigit'
import type { DispatchDate } from '@entities/date/domain/types'

/**
 * Значение для марки по дате отправки: 1…99, 100 при сроке ≥100 лет, или `null`.
 */
export function useMarkStampYearCount(
  simplifiedPeek: boolean,
): number | null {
  const draftDates = useAppSelector(selectDraftDispatchDates)
  const { listRowInner } = useRightListArchiveMini()

  const dispatchDate = useMemo((): DispatchDate | null => {
    if (simplifiedPeek) {
      return primaryDispatchDateFromPieInner(listRowInner)
    }
    return draftDates[0] ?? null
  }, [simplifiedPeek, listRowInner, draftDates])

  return useMemo(
    () => markStampYearCountFromDispatch(new Date(), dispatchDate),
    [dispatchDate],
  )
}
