import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  closeDayPanel,
  setDateListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { selectIsDateListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { CardsListPanel } from '../dayPanel/CardsListPanel'
import { DateListPanel } from './DateListPanel'
import styles from './DateRightSlot.module.scss'

export const DateRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const openDayPanel = useAppSelector((state) => state.calendar.openDayPanel)
  const dateListOpen = useAppSelector(selectIsDateListPanelOpen)

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

  if (openDayPanel) {
    return (
      <div className={styles.root}>
        <div className={styles.panelWrap}>
          <CardsListPanel
            dateKey={openDayPanel.dateKey}
            dayData={openDayPanel.dayData}
            onClose={() => dispatch(closeDayPanel())}
          />
        </div>
      </div>
    )
  }

  if (dateListOpen) {
    return (
      <div className={styles.root}>
        <div className={styles.panelWrap}>
          <DateListPanel onClose={handleCloseList} />
        </div>
      </div>
    )
  }

  return null
}
