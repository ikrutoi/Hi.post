import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { selectDateListToolbarBadgeCount } from '@date/infrastructure/selectors'

/**
 * Держит badge у `listDate` (секция date) в Redux — как EditorPieListCardPieBadgeSync,
 * чтобы счётчик обновлялся при смене дат даже когда DateListPanel размонтирован.
 */
export const DateToolbarListDateBadgeSync: React.FC = () => {
  const dispatch = useAppDispatch()
  const count = useAppSelector(selectDateListToolbarBadgeCount)
  const prevCount = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (prevCount.current === count) return
    prevCount.current = count
    dispatch(
      updateToolbarIcon({
        section: 'date',
        key: 'listDate',
        value: {
          options: { badge: count > 0 ? count : null },
        },
      }),
    )
  }, [count, dispatch])

  return null
}
