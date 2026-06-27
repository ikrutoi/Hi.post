import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { dispatchCardPieToolbarBadge } from '@toolbar/application/syncCardPieToolbarIcons'
import { selectEditorPieCardPieToolbarBadgeCount } from '@entities/cardEditor/infrastructure/selectors'

/**
 * Синхронизирует тулбар editorPie: badge у `cardPie`.
 */
export const EditorPieListCardPieBadgeSync: React.FC = () => {
  const dispatch = useAppDispatch()
  const count = useAppSelector(selectEditorPieCardPieToolbarBadgeCount)
  const prevCount = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (prevCount.current === count) return
    prevCount.current = count
    dispatchCardPieToolbarBadge(dispatch, count)
  }, [count, dispatch])

  return null
}
