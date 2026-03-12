import React from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setCardtextListPanelOpen } from '@cardtext/infrastructure/state'
import { CardtextListPanel } from './CardtextListPanel/CardtextListPanel'
import styles from './CardtextRightSlot.module.scss'

export const CardtextRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(
    (state) => (state.cardtext as any).isListPanelOpen === true,
  )

  if (!isOpen) return null

  return (
    <div className={styles.root}>
      <div className={styles.panelWrap}>
        <CardtextListPanel
          onClose={() => {
            dispatch(setCardtextListPanelOpen(false))
          }}
        />
      </div>
    </div>
  )
}

