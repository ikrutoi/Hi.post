import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  setCardtextListPanelOpen,
  setCardtextShowViewMode,
  restoreCardtextSession,
  setCardtextAssetId,
} from '@cardtext/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type { CardtextTemplate } from '@cardtext/domain/types'
import { CardtextListPanel } from './CardtextListPanel/CardtextListPanel'
import styles from './CardtextRightSlot.module.scss'

export const CardtextRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(
    (state) => (state.cardtext as any).isListPanelOpen === true,
  )

  const handleClose = useCallback(() => {
    dispatch(setCardtextListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'cardtext',
        key: 'listCardtext',
        value: 'enabled',
      }),
    )
  }, [dispatch])

  const handleSelectTemplate = useCallback(
    (entry: CardtextTemplate) => {
      dispatch(setCardtextAssetId(entry.id))
      dispatch(
        restoreCardtextSession({
          assetId: entry.id,
          value: entry.value,
          style: entry.style,
          title: entry.title,
          plainText: entry.plainText,
          cardtextLines: entry.cardtextLines,
          favorite: entry.favorite ?? null,
        }),
      )
      dispatch(setCardtextShowViewMode(true))
    },
    [dispatch],
  )

  if (!isOpen) return null

  return (
    <div className={styles.root}>
      <div className={styles.panelWrap}>
        <CardtextListPanel onClose={handleClose} onSelect={handleSelectTemplate} />
      </div>
    </div>
  )
}

