import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { selectCardPieListPanelRowCount } from '@date/infrastructure/selectors'

/**
 * Держит badge у `listCardPie` (editorPie) равным числу строк в CardPie list panel.
 */
export const EditorPieListCardPieBadgeSync: React.FC = () => {
  const dispatch = useAppDispatch()
  const count = useAppSelector(selectCardPieListPanelRowCount)
  const prevCount = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (prevCount.current === count) return
    prevCount.current = count
    dispatch(
      updateToolbarIcon({
        section: 'editorPie',
        key: 'listCardPie',
        value: {
          options: { badge: count > 0 ? count : null },
        },
      }),
    )
  }, [count, dispatch])

  return null
}
