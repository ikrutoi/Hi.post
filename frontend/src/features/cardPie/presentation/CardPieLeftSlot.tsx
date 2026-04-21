import React, { useCallback } from 'react'
import { useAppDispatch } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { setCardPieListPanelOpen } from '@date/calendar/infrastructure/state'
import { CardPiePanel } from './CardPiePanel'
import styles from './CardPieLeftSlot.module.scss'

export const CardPieLeftSlot: React.FC = () => {
  const dispatch = useAppDispatch()

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

  return (
    <div className={styles.root}>
      <div className={styles.panelWrap}>
        <CardPiePanel onClose={handleCloseList} entries={[]} />
      </div>
    </div>
  )
}
