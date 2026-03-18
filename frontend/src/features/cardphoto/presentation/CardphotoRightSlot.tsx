import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  setCardphotoListPanelOpen,
} from '@cardphoto/infrastructure/state'
import { selectIsListPanelOpen } from '@cardphoto/infrastructure/selectors'
import { CardphotoListPanel } from './CardphotoListPanel/CardphotoListPanel'
import styles from './CardphotoRightSlot.module.scss'

export const CardphotoRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsListPanelOpen)

  const handleClose = useCallback(() => {
    dispatch(setCardphotoListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'listCardphoto',
        value: 'enabled',
      }),
    )
  }, [dispatch])

  if (!isOpen) return null

  return (
    <div className={styles.root}>
      <div className={styles.panelWrap}>
        <CardphotoListPanel onClose={handleClose} />
      </div>
    </div>
  )
}

