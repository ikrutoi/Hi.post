import { useLayoutEffect, useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectDraftDispatchDates } from '@date/infrastructure/selectors'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { primaryDispatchDateFromPieInner } from '@features/cardPie/domain/primaryDispatchDateFromPieInner'
import { markStampYearCountFromDispatch } from '../../domain/markStampYearDigit'
import { useMarkStampYearDevOptional } from '../MarkStampYearDevContext'
import type { DispatchDate } from '@entities/date/domain/types'

/**
 * Значение для марки только по дате (1…99, 100 при сроке ≥100 лет, или `null`), без dev-override.
 */
export function useMarkStampYearCountComputed(
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

/**
 * Значение для марки (1…100 или `null`): дата + временный override из dev-кнопок.
 */
export function useMarkStampYearCount(
  simplifiedPeek: boolean,
): number | null {
  const computed = useMarkStampYearCountComputed(simplifiedPeek)
  const dev = useMarkStampYearDevOptional()

  useLayoutEffect(() => {
    dev?.syncComputedFromDispatch(computed)
  }, [computed, dev])

  if (dev?.override != null) {
    return Math.min(100, Math.max(1, Math.round(dev.override)))
  }
  return computed
}
