import React, { useCallback, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { IconListCardtext } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { openCardtextEditorFromView } from '@cardtext/application/helpers'
import { selectCardtextAssetStatus } from '@cardtext/infrastructure/selectors'
import { useTemplateActions } from '@entities/templates/application/hooks/useTemplateActions'
import { removeCardtextTemplateId } from '@features/previewStrip/infrastructure/state'
import {
  selectCardtextTemplatesListItems,
  selectCardtextTemplatesListLoading,
  selectCardtextId,
  selectCardtextListPanelDensity,
  selectCardtextListSortDirection,
} from '@cardtext/infrastructure/selectors'
import {
  loadCardtextTemplatesRequest,
  resetCardtextAssetToEmptyDraft,
  setCardtextId,
} from '@cardtext/infrastructure/state'
import type { CardtextContent } from '@cardtext/domain/types'
import { CardtextListEntry } from './CardtextListEntry'
import clsx from 'clsx'
import styles from './CardtextListPanel.module.scss'

type Props = {
  onClose: () => void
  onSelect?: (entry: CardtextContent) => void
}

function sortTemplatesByTitle(
  list: CardtextContent[],
  direction: 'asc' | 'desc',
): CardtextContent[] {
  const sorted = [...list].sort((a, b) =>
    (a.title ?? '').trim().localeCompare((b.title ?? '').trim(), undefined, {
      sensitivity: 'base',
    }),
  )
  return direction === 'desc' ? sorted.reverse() : sorted
}

export const CardtextListPanel: React.FC<Props> = ({ onClose, onSelect }) => {
  const dispatch = useAppDispatch()
  const { deleteCardtextTemplate } = useTemplateActions()
  const items = useAppSelector(selectCardtextTemplatesListItems)
  const sortDirection = useAppSelector(selectCardtextListSortDirection)
  const panelDensity = useAppSelector(selectCardtextListPanelDensity)
  const sortedTemplates = useMemo(
    () => sortTemplatesByTitle(items ?? [], sortDirection),
    [items, sortDirection],
  )
  const isLoading = useAppSelector(selectCardtextTemplatesListLoading)
  const selectedTemplateId = useAppSelector(selectCardtextId)
  const cardtextAssetStatus = useAppSelector(selectCardtextAssetStatus)
  const isCardtextViewEditMode = useAppSelector(
    (state) => state.cardtext.isCardtextViewEditMode === true,
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = useCallback(
    (entry: CardtextContent) => {
      setSelectedId(entry.id)
      onSelect?.(entry)
    },
    [onSelect],
  )

  const handleEdit = useCallback(
    (entry: CardtextContent) => {
      handleSelect(entry)
      openCardtextEditorFromView(
        dispatch,
        entry.status ?? cardtextAssetStatus,
      )
    },
    [dispatch, handleSelect, cardtextAssetStatus],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await deleteCardtextTemplate(id)
      if (!result.success) return
      dispatch(removeCardtextTemplateId(id))
      dispatch(loadCardtextTemplatesRequest())
      if (selectedId === id) setSelectedId(null)
      if (selectedTemplateId === id) {
        dispatch(resetCardtextAssetToEmptyDraft())
        dispatch(setCardtextId(null))
      }
    },
    [
      deleteCardtextTemplate,
      dispatch,
      selectedId,
      selectedTemplateId,
    ],
  )

  const hasRows = sortedTemplates.length > 0

  return (
    <div className={clsx(styles.panel, !hasRows && styles.panelEmptyNoToolbar)}>
      <ListPanelStackedHeader
        leadIconKey="listCardtext"
        toolbar={hasRows ? <Toolbar section="cardtextList" /> : false}
        showDividerWithoutToolbar={!hasRows}
        onClose={onClose}
        closeAriaLabel="Close text templates list"
      />
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          className={styles.list}
          data-density-level={panelDensity}
          tabIndex={0}
          aria-label="Cardtext templates list"
        >
          {!isLoading && sortedTemplates.length === 0 && (
            <div className={styles.listEmpty} aria-hidden>
              <IconListCardtext className={styles.listEmptyIcon} />
            </div>
          )}
          {!isLoading &&
            sortedTemplates.map((entry) => (
              <div key={entry.id} role="option">
                <CardtextListEntry
                  entry={entry}
                  onSelect={handleSelect}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isSelected={
                    selectedId === entry.id || selectedTemplateId === entry.id
                  }
                  isEditActive={
                    isCardtextViewEditMode && selectedTemplateId === entry.id
                  }
                  density={panelDensity}
                />
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  )
}
