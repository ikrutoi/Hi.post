import React, { useCallback } from 'react'
import { useAppDispatch } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  updateLastViewedCalendarDate,
  setDateListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { DateListPanel, type DateListPanelItem } from './DateListPanel'
import { useCalendarFacade } from '@date/calendar/application/facades/useCalendarFacade'
import styles from './DateRightSlot.module.scss'

/** Левый слот: список дат календаря. Список истории — см. `HistoryListRightSlot` в правой колонке. */
export const DateRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const { dateListPanelOpen } = useCalendarFacade()

  const handleCloseList = useCallback(() => {
    dispatch(setDateListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'date',
        key: 'listDate',
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

  if (dateListPanelOpen) {
    return (
      <div className={styles.root}>
        <div className={styles.panelWrap}>
          <DateListPanel
            onClose={handleCloseList}
            onSelectEntry={handleSelectEntry}
          />
        </div>
      </div>
    )
  }

  return null
}
