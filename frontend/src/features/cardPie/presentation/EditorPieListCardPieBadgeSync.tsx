import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { selectCardPieToolbarBadgeCount } from '@entities/cardEditor/infrastructure/selectors'

/**
 * Держит badge у `cardPie` (editorPie): строки списка или минимум 1 при любой заполненной секции.
 */
export const EditorPieListCardPieBadgeSync: React.FC = () => {
  const dispatch = useAppDispatch()
  const count = useAppSelector(selectCardPieToolbarBadgeCount)
  const prevCount = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (prevCount.current === count) return
    prevCount.current = count
    dispatch(
      updateToolbarIcon({
        section: 'editorPie',
        key: 'cardPie',
        value: {
          options: { badge: count > 0 ? count : null },
        },
      }),
    )
  }, [count, dispatch])

  return null
}
