import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectCardPieListSortDirection } from '@date/calendar/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  updateLastViewedCalendarDate,
  setCardPieListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { useDispatchPlanListEntries } from '@date/application/hooks/useDispatchPlanListEntries'
import type { DateListPanelItem } from '@date/presentation/DateListPanel'
import { CardPiePanel } from './CardPiePanel'
import styles from './CardPieLeftSlot.module.scss'

export const CardPieLeftSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const listSortDirection = useAppSelector(selectCardPieListSortDirection)
  const entries = useDispatchPlanListEntries({
    activeModeOnly: true,
    listSortDirection,
    hideBranchesInCart: true,
    showUndatedWhenAnySectionSelected: true,
  })

  const handleCloseList = useCallback(() => {
    dispatch(setCardPieListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'editorPie',
        key: 'listCardPie',
        value: 'enabled',
      }),
    )
  }, [dispatch])

  const handleSelectEntry = useCallback(
    (item: DateListPanelItem) => {
      if (!item.sourceDate) return
      dispatch(
        updateLastViewedCalendarDate({
          year: item.sourceDate.year,
          month: item.sourceDate.month,
        }),
      )
    },
    [dispatch],
  )

  return (
    <div className={styles.root}>
      <div className={styles.panelWrap}>
        <CardPiePanel
          onClose={handleCloseList}
          entries={entries}
          onSelectEntry={handleSelectEntry}
        />
      </div>
    </div>
  )
}
