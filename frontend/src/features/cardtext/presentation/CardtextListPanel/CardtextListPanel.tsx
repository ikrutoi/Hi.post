import React, { useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { IconX, IconListCardtext } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import {
  selectCardtextTemplatesListItems,
  selectCardtextTemplatesListLoading,
  selectCurrentCardtextTemplateId,
} from '@cardtext/infrastructure/selectors'
import {
  setFavorite,
  loadCardtextTemplatesRequest,
} from '@cardtext/infrastructure/state'
import { useTemplateActions } from '@entities/templates/application/hooks/useTemplateActions'
import type { CardtextTemplate } from '@entities/templates/domain/types/cardtextTemplate.types'
import { CardtextListEntry } from './CardtextListEntry'
import styles from './CardtextListPanel.module.scss'

type Props = {
  onClose: () => void
  onSelect?: (entry: CardtextTemplate) => void
}

export const CardtextListPanel: React.FC<Props> = ({ onClose, onSelect }) => {
  const dispatch = useAppDispatch()
  const templates = useAppSelector(selectCardtextTemplatesListItems)
  const isLoading = useAppSelector(selectCardtextTemplatesListLoading)
  const { deleteCardtextTemplate, updateCardtextTemplate } = useTemplateActions()
  const currentTemplateId = useAppSelector(selectCurrentCardtextTemplateId)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = useCallback(
    (entry: CardtextTemplate) => {
      setSelectedId(entry.id)
      onSelect?.(entry)
    },
    [onSelect],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteCardtextTemplate(id)
      if (selectedId === id) setSelectedId(null)
      dispatch(loadCardtextTemplatesRequest())
    },
    [deleteCardtextTemplate, selectedId, dispatch],
  )

  const handleToggleStar = useCallback(
    async (entry: CardtextTemplate) => {
      const next = entry.favorite === true ? false : true
      await updateCardtextTemplate(entry.id, { favorite: next })
      if (currentTemplateId === entry.id) {
        dispatch(setFavorite(next))
      }
      dispatch(loadCardtextTemplatesRequest())
    },
    [updateCardtextTemplate, currentTemplateId, dispatch],
  )

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerToolbar}>
          <Toolbar section="cardtextList" />
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close text templates list"
        >
          <IconX />
        </button>
      </div>
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          className={styles.list}
          tabIndex={0}
          aria-label="Cardtext templates list"
        >
          {!isLoading && templates.length === 0 && (
            <div className={styles.listEmpty} aria-hidden>
              <IconListCardtext className={styles.listEmptyIcon} />
            </div>
          )}
          {!isLoading &&
            templates.length > 0 &&
            templates.map((entry) => (
              <CardtextListEntry
                key={entry.id}
                entry={entry}
                onSelect={handleSelect}
                onDelete={handleDelete}
                onEdit={handleSelect}
                isStarred={entry.favorite === true}
                onToggleStar={() => handleToggleStar(entry)}
                isSelected={selectedId === entry.id}
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  )
}
