import React, { useCallback, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { IconX, IconListCardtext } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import {
  selectCardtextTemplatesListItems,
  selectCardtextTemplatesListLoading,
  selectCardtextAssetId,
  selectCardtextListSortDirection,
} from '@cardtext/infrastructure/selectors'
import {
  setFavorite,
  loadCardtextTemplatesRequest,
  updateCardtextTemplateFavoriteInList,
} from '@cardtext/infrastructure/state'
import { useTemplateActions } from '@entities/templates/application/hooks/useTemplateActions'
import type { CardtextTemplate } from '@cardtext/domain/types'
import { CardtextListEntry } from './CardtextListEntry'
import styles from './CardtextListPanel.module.scss'

type Props = {
  onClose: () => void
  onSelect?: (entry: CardtextTemplate) => void
}

function sortTemplatesByTitle(
  list: CardtextTemplate[],
  direction: 'asc' | 'desc',
): CardtextTemplate[] {
  const sorted = [...list].sort((a, b) =>
    (a.title ?? '').trim().localeCompare((b.title ?? '').trim(), undefined, {
      sensitivity: 'base',
    }),
  )
  return direction === 'desc' ? sorted.reverse() : sorted
}

export const CardtextListPanel: React.FC<Props> = ({ onClose, onSelect }) => {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCardtextTemplatesListItems)
  const sortDirection = useAppSelector(selectCardtextListSortDirection)
  const { favoriteTemplates, restTemplates, combinedTemplates } = useMemo(() => {
    const list = items ?? []
    const favorite = list.filter((e) => e.favorite === true)
    const rest = list.filter((e) => e.favorite !== true)
    const favoriteSorted = sortTemplatesByTitle(favorite, sortDirection)
    const restSorted = sortTemplatesByTitle(rest, sortDirection)
    return {
      favoriteTemplates: favoriteSorted,
      restTemplates: restSorted,
      combinedTemplates: [...favoriteSorted, ...restSorted],
    }
  }, [items, sortDirection])
  const isLoading = useAppSelector(selectCardtextTemplatesListLoading)
  const { deleteCardtextTemplate, updateCardtextTemplate } = useTemplateActions()
  const assetId = useAppSelector(selectCardtextAssetId)
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
      dispatch(updateCardtextTemplateFavoriteInList({ id: entry.id, favorite: next }))
      if (assetId === entry.id) {
        dispatch(setFavorite(next))
      }
    },
    [updateCardtextTemplate, assetId, dispatch],
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
          {!isLoading && combinedTemplates.length === 0 && (
            <div className={styles.listEmpty} aria-hidden>
              <IconListCardtext className={styles.listEmptyIcon} />
            </div>
          )}
          {!isLoading &&
            combinedTemplates.length > 0 && (
              <>
                {favoriteTemplates.map((entry) => (
                  <CardtextListEntry
                    key={entry.id}
                    entry={entry}
                    onSelect={handleSelect}
                    onDelete={handleDelete}
                    onEdit={handleSelect}
                    isStarred
                    onToggleStar={() => handleToggleStar(entry)}
                    isSelected={selectedId === entry.id}
                  />
                ))}
                {favoriteTemplates.length > 0 && (
                  <div className={styles.favoritesSeparator} aria-hidden />
                )}
                {restTemplates.map((entry) => (
                  <CardtextListEntry
                    key={entry.id}
                    entry={entry}
                    onSelect={handleSelect}
                    onDelete={handleDelete}
                    onEdit={handleSelect}
                    isStarred={false}
                    onToggleStar={() => handleToggleStar(entry)}
                    isSelected={selectedId === entry.id}
                  />
                ))}
              </>
            )}
        </div>
      </ScrollArea>
    </div>
  )
}
