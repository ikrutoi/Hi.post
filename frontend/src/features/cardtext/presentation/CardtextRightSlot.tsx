import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setCardtextListPanelOpen } from '@cardtext/infrastructure/state'
import { selectIsCardtextListPanelOpen } from '@cardtext/infrastructure/selectors'
import { useCardtextListTemplateSelect } from '@cardtext/application/hooks/useCardtextListTemplateSelect'
import { CardtextListPanel } from './CardtextListPanel/CardtextListPanel'
import styles from './CardtextRightSlot.module.scss'

export const CardtextRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsCardtextListPanelOpen)
  const handleSelectTemplate = useCardtextListTemplateSelect()

  const handleClose = useCallback(() => {
    dispatch(setCardtextListPanelOpen(false))
  }, [dispatch])

  if (!isOpen) return null

  return (
    <div className={styles.root}>
      <div className={styles.panelWrap}>
        <CardtextListPanel
          onClose={handleClose}
          onSelect={handleSelectTemplate}
        />
      </div>
    </div>
  )
}
