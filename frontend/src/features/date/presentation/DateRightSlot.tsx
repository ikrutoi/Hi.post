import React from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { closeDayPanel } from '../calendar/infrastructure/state/calendar.slice'
import { CardsListPanel } from '../dayPanel/CardsListPanel'
import styles from './DateRightSlot.module.scss'

export const DateRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const openDayPanel = useAppSelector((state) => state.calendar.openDayPanel)

  if (!openDayPanel) return null

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
