import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  setCardtextListPanelOpen,
  restoreCardtextSession,
  setCardtextId,
  setCardtextPresetData,
  setDraftData,
  setCardtextAppliedData,
} from '@cardtext/infrastructure/state'
import {
  selectCardtextSource,
  selectCardtextSessionData,
  selectCardtextId,
} from '@cardtext/infrastructure/selectors'
import type { CardtextCreateDraft } from '@/features/cardtext/domain/editor/editor.types'
import type { CardtextContent } from '@cardtext/domain/types'
import { CardtextListPanel } from './CardtextListPanel/CardtextListPanel'
import styles from './CardtextRightSlot.module.scss'

export const CardtextRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(
    (state) => (state.cardtext as any).isListPanelOpen === true,
  )
  const source = useAppSelector(selectCardtextSource)
  const currentTemplateId = useAppSelector(selectCardtextId)
  const session = useAppSelector(selectCardtextSessionData)

  const handleClose = useCallback(() => {
    dispatch(setCardtextListPanelOpen(false))
  }, [dispatch])

  const handleSelectTemplate = useCallback(
    (entry: CardtextContent) => {
      // Если сейчас открыт редактор в режиме создания (id шаблона == null),
      // то перед переключением на сохранённый пресет сохраняем текущий текст как draftData.
      if (
        source === 'draft' &&
        (currentTemplateId == null || currentTemplateId === null)
      ) {
        const draft: CardtextCreateDraft = {
          value: session.value ?? [],
          style: session.style,
          plainText: session.plainText,
          cardtextLines: session.cardtextLines,
          timestamp: session.timestamp,
        }
        dispatch(setDraftData(draft))
      }

      dispatch(setCardtextId(entry.id))
      // Store the selected preset snapshot so we can reason about "previous selection"
      // separately from the current editor content.
      dispatch(setCardtextPresetData(entry))
      // Selecting another text/template starts editing again, so "applied" state must be cleared.
      dispatch(setCardtextAppliedData(null))
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
    },
    [dispatch, source, currentTemplateId, session],
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
