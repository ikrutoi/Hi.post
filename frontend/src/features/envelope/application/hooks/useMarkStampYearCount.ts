import { useMemo } from 'react'
import { useDateFacade } from '@date/application/facades/useDateFacade'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { primaryDispatchDateFromPieInner } from '@features/cardPie/domain/primaryDispatchDateFromPieInner'
import { markStampYearCountFromDispatch } from '../../domain/markStampYearDigit'
import type { DispatchDate } from '@entities/date/domain/types'

function editorPrimaryDispatchDate(
  selectedDate: DispatchDate | null,
  mergedDispatchDates: DispatchDate[],
): DispatchDate | null {
  if (selectedDate != null) return selectedDate
  return mergedDispatchDates[0] ?? null
}

/**
 * Значение для марки (1…99): полосы по среднему году от сегодня до даты отправления.
 * В peek — дата строки списка; иначе — выбранная / первая из merged в редакторе.
 */
export function useMarkStampYearCount(simplifiedPeek: boolean): number {
  const { selectedDate, mergedDispatchDates } = useDateFacade()
  const { listRowInner } = useRightListArchiveMini()

  const dispatchDate = useMemo((): DispatchDate | null => {
    if (simplifiedPeek) {
      return primaryDispatchDateFromPieInner(listRowInner)
    }
    return editorPrimaryDispatchDate(selectedDate, mergedDispatchDates)
  }, [
    simplifiedPeek,
    listRowInner,
    selectedDate,
    mergedDispatchDates,
  ])

  return useMemo(
    () => markStampYearCountFromDispatch(new Date(), dispatchDate),
    [dispatchDate],
  )
}
