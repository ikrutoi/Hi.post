import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  setCardtextListPanelOpen,
  setCardtextCurrentView,
  restoreCardtextSession,
  setCardtextAssetId,
  setCreateDraft,
} from '@cardtext/infrastructure/state'
import {
  selectCardtextCurrentView,
  selectCardtextSessionData,
  selectCardtextAssetId,
} from '@cardtext/infrastructure/selectors'
import type { CardtextCreateDraft } from '@/features/cardtext/domain/editor/editor.types'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type { CardtextTemplate } from '@cardtext/domain/types'
import { CardtextListPanel } from './CardtextListPanel/CardtextListPanel'
import styles from './CardtextRightSlot.module.scss'

export const CardtextRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(
    (state) => (state.cardtext as any).isListPanelOpen === true,
  )
  const currentView = useAppSelector(selectCardtextCurrentView)
  const currentAssetId = useAppSelector(selectCardtextAssetId)
  const session = useAppSelector(selectCardtextSessionData)

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
      // Если сейчас открыт редактор в режиме создания (assetId == null),
      // то перед переключением на сохранённый шаблон сохраняем текущий текст как createDraft.
      if (
        currentView === 'cardtextEditor' &&
        (currentAssetId == null || currentAssetId === null)
      ) {
        const draft: CardtextCreateDraft = {
          value: session.value ?? [],
          style: session.style,
          plainText: session.plainText,
          cardtextLines: session.cardtextLines,
        }
        dispatch(setCreateDraft(draft))
      }

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
      dispatch(setCardtextCurrentView('cardtextView'))
    },
    [dispatch, currentView, currentAssetId, session],
  )

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
