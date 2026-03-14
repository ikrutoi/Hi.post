import React, { useCallback, useState } from 'react'
import { IconX, IconListCardtext } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { useCardtextTemplates } from '@entities/templates/application/hooks/useTemplates'
import { useTemplateActions } from '@entities/templates/application/hooks/useTemplateActions'
import type { CardtextTemplate } from '@entities/templates/domain/types/cardtextTemplate.types'
import { CardtextListEntry } from './CardtextListEntry'
import styles from './CardtextListPanel.module.scss'

type Props = {
  onClose: () => void
  onSelect?: (entry: CardtextTemplate) => void
}

export const CardtextListPanel: React.FC<Props> = ({ onClose, onSelect }) => {
  const { templates, isLoading, reload } = useCardtextTemplates()
  const { deleteCardtextTemplate } = useTemplateActions()
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
      reload()
    },
    [deleteCardtextTemplate, selectedId, reload],
  )

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Text templates</span>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close text templates list"
        >
          <IconX />
        </button>
      </div>
      <div className={styles.toolbarWrap}>
        <Toolbar section="cardtextList" />
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
                isSelected={selectedId === entry.id}
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  )
}
