import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import {
  sortCardphotoListRows,
  type CardphotoListSortableRow,
} from '../helpers/cardphotoListSort'
import { selectCardphotoListSortMode } from '@cardphoto/infrastructure/selectors'

export function useCardphotoListSort<T extends CardphotoListSortableRow>(
  rows: readonly T[],
): T[] {
  const sortMode = useAppSelector(selectCardphotoListSortMode)
  return useMemo(
    () => sortCardphotoListRows(rows, sortMode),
    [rows, sortMode],
  )
}
