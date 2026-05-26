import { useEffect, useMemo, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  getCardphotoListSortModeSequence,
  getDefaultCardphotoListSortMode,
  resolveCardphotoListTitleCoverage,
  sortCardphotoListRows,
  type CardphotoListSortableRow,
  type CardphotoListSortMode,
} from '../helpers/cardphotoListSort'
import {
  selectCardphotoListSortMode,
} from '@cardphoto/infrastructure/selectors'
import {
  setCardphotoListSortMode,
  setCardphotoListTitleCoverage,
} from '@cardphoto/infrastructure/state/cardphotoUiSlice'

export function useCardphotoListSort<T extends CardphotoListSortableRow>(
  rows: readonly T[],
): {
  sortedRows: T[]
  sortMode: CardphotoListSortMode
} {
  const dispatch = useAppDispatch()
  const sortMode = useAppSelector(selectCardphotoListSortMode)
  const prevCoverageRef = useRef<ReturnType<typeof resolveCardphotoListTitleCoverage> | null>(
    null,
  )

  const titleCoverage = useMemo(
    () => resolveCardphotoListTitleCoverage(rows),
    [rows],
  )

  useEffect(() => {
    dispatch(setCardphotoListTitleCoverage(titleCoverage))
  }, [titleCoverage, dispatch])

  useEffect(() => {
    if (prevCoverageRef.current === titleCoverage) return
    prevCoverageRef.current = titleCoverage
    dispatch(setCardphotoListSortMode(getDefaultCardphotoListSortMode(titleCoverage)))
  }, [titleCoverage, dispatch])

  useEffect(() => {
    const allowed = new Set(getCardphotoListSortModeSequence(titleCoverage))
    if (!allowed.has(sortMode)) {
      dispatch(setCardphotoListSortMode(getDefaultCardphotoListSortMode(titleCoverage)))
    }
  }, [titleCoverage, sortMode, dispatch])

  const sortedRows = useMemo(
    () => sortCardphotoListRows(rows, sortMode),
    [rows, sortMode],
  )

  return {
    sortedRows,
    sortMode,
  }
}
