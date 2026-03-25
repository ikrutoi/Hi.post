import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  setCardtextListPanelOpen,
  setCardtextCurrentView,
  restoreCardtextSession,
  setCardtextId,
  setCreateDraft,
} from '@cardtext/infrastructure/state'
import {
  selectCardtextCurrentView,
  selectCardtextSessionData,
  selectCardtextId,
} from '@cardtext/infrastructure/selectors'
import type { CardtextCreateDraft } from '@/features/cardtext/domain/editor/editor.types'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type { CardtextContent } from '@cardtext/domain/types'
import { CardtextListPanel } from './CardtextListPanel/CardtextListPanel'
import styles from './CardtextRightSlot.module.scss'

export const CardtextRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(
    (state) => (state.cardtext as any).isListPanelOpen === true,
  )
  const currentView = useAppSelector(selectCardtextCurrentView)
  const currentTemplateId = useAppSelector(selectCardtextId)
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
    (entry: CardtextContent) => {
      // Если сейчас открыт редактор в режиме создания (id шаблона == null),
      // то перед переключением на сохранённый шаблон сохраняем текущий текст как createDraft.
      if (
        currentView === 'cardtextEditor' &&
        (currentTemplateId == null || currentTemplateId === null)
      ) {
        const draft: CardtextCreateDraft = {
          value: session.value ?? [],
          style: session.style,
          plainText: session.plainText,
          cardtextLines: session.cardtextLines,
          timestamp: session.timestamp,
        }
        dispatch(setCreateDraft(draft))
      }

      dispatch(setCardtextId(entry.id))
      dispatch(
        restoreCardtextSession({
          id: entry.id,
          value: entry.value,
          style: entry.style,
          title: entry.title,
          plainText: entry.plainText,
          cardtextLines: entry.cardtextLines,
          favorite: entry.favorite ?? null,
          timestamp: entry.timestamp,
          status: entry.status ?? 'inLine',
        }),
      )
      dispatch(setCardtextCurrentView('cardtextView'))
    },
    [dispatch, currentView, currentTemplateId, session],
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
