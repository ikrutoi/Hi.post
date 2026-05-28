import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  selectEditorPieCardPieToolbarBadgeCount,
  selectPieProgress,
} from '@entities/cardEditor/infrastructure/selectors'

/**
 * Синхронизирует тулбар editorPie: badge у `cardPie`, enabled/disabled у `delete`.
 */
export const EditorPieListCardPieBadgeSync: React.FC = () => {
  const dispatch = useAppDispatch()
  const count = useAppSelector(selectEditorPieCardPieToolbarBadgeCount)
  const { progress } = useAppSelector(selectPieProgress)
  const prevCount = useRef<number | undefined>(undefined)
  const prevDeleteEnabled = useRef<boolean | undefined>(undefined)

  const deleteEnabled = progress > 0

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

  useEffect(() => {
    if (prevDeleteEnabled.current === deleteEnabled) return
    prevDeleteEnabled.current = deleteEnabled
    dispatch(
      updateToolbarIcon({
        section: 'editorPie',
        key: 'delete',
        value: deleteEnabled ? 'enabled' : 'disabled',
      }),
    )
  }, [deleteEnabled, dispatch])

  return null
}
