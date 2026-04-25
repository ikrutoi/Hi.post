import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { IconX, IconListCardPie } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelHeaderWithLead } from '@shared/ui/ListPanelHeaderWithLead/ListPanelHeaderWithLead'
import { requestCalendarPreview } from '@entities/card/infrastructure/state'
import { selectCalendarPreviewDisplayUrl } from '@entities/card/infrastructure/selectors'
import { selectPieProgress } from '@entities/cardEditor/infrastructure/selectors'
import { toggleCartForDispatchBranch } from '@date/infrastructure/state'
import { CardPieListEntry } from './cardPieList/CardPieListEntry'
import type { DateListPanelItem } from '@date/presentation/DateListPanel'
import styles from './CardPiePanel.module.scss'

type Props = {
  onClose: () => void
  entries?: DateListPanelItem[]
  onSelectEntry?: (item: DateListPanelItem) => void
}

const isBlobUrl = (url: string | null | undefined): boolean =>
  typeof url === 'string' && url.startsWith('blob:')

const CardPiePanelRow: React.FC<{
  item: DateListPanelItem
  onSelectEntry?: (item: DateListPanelItem) => void
  canToggleCart?: boolean
}> = ({ item, onSelectEntry, canToggleCart }) => {
  const dispatch = useAppDispatch()
  const cachedUrl = useAppSelector(
    selectCalendarPreviewDisplayUrl(item.cardId ?? ''),
  )

  useEffect(() => {
    if (item.cardId && !cachedUrl && item.previewUrl) {
      dispatch(
        requestCalendarPreview({
          cardId: item.cardId,
          previewUrl: item.previewUrl,
        }),
      )
    }
  }, [dispatch, cachedUrl, item.cardId, item.previewUrl])

  const allowBlobFallback =
    item.cardId === 'current_session' || Boolean(item.previewIsProcessed)
  const safeFallbackUrl =
    isBlobUrl(item.previewUrl) && !allowBlobFallback ? null : item.previewUrl
  const displayUrl = cachedUrl ?? safeFallbackUrl

  const handleToggleCart = useCallback(() => {
    if (item.dispatchBranchKey) {
      dispatch(toggleCartForDispatchBranch({ branchKey: item.dispatchBranchKey }))
    }
  }, [dispatch, item.dispatchBranchKey])

  const onAddCartFromList =
    canToggleCart && item.dispatchBranchKey ? handleToggleCart : undefined

  return (
    <CardPieListEntry
      key={item.id}
      dateLabel={item.dateLabel}
      previewUrl={displayUrl}
      detailLine={item.detailLine}
      priceLine={item.priceLine}
      variant={item.variant}
      onSelect={
        onSelectEntry && item.variant !== 'inactive'
          ? () => onSelectEntry(item)
          : undefined
      }
      onAddCart={onAddCartFromList}
    />
  )
}

export const CardPiePanel: React.FC<Props> = ({
  onClose,
  entries = [],
  onSelectEntry,
}) => {
  const { isAllComplete } = useAppSelector(selectPieProgress)

  const hasRows = entries.length > 0
  const listContentKey = entries.map((e) => e.id).join('|')

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerToolbar}>
          <ListPanelHeaderWithLead
            leadIconKey="listCardPie"
            toolbar={<Toolbar section="cardPieList" />}
          />
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close card pie list"
        >
          <IconX />
        </button>
      </div>
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          key={listContentKey}
          className={styles.list}
          tabIndex={0}
          aria-label="Card pie variants list"
        >
          {hasRows ? (
            entries.map((item) => (
              <CardPiePanelRow
                key={item.id}
                item={item}
                onSelectEntry={onSelectEntry}
                canToggleCart={isAllComplete}
              />
            ))
          ) : (
            <div className={styles.listEmpty} aria-hidden>
              <IconListCardPie className={styles.listEmptyIcon} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
