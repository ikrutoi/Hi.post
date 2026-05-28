import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { IconCardPie } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { useCartFacade } from '@cart/application/facades'
import { useListCardPreviewUrl } from '@entities/card/application/hooks/useListCardPreviewUrl'
import { selectPieProgress } from '@entities/cardEditor/infrastructure/selectors'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import {
  clearCardPieEditorSession,
  toggleCartForDispatchBranch,
} from '@date/infrastructure/state'
import { CardPieListEntry } from './cardPieList/CardPieListEntry'
import type { DateListPanelItem } from '@date/presentation/DateListPanel'
import type { IconKey } from '@shared/config/constants'
import clsx from 'clsx'
import styles from './CardPiePanel.module.scss'

type Props = {
  onClose: () => void
  entries?: DateListPanelItem[]
  onSelectEntry?: (item: DateListPanelItem) => void
}

const CardPiePanelRow: React.FC<{
  item: DateListPanelItem
  onSelectEntry?: (item: DateListPanelItem) => void
  canToggleCart?: boolean
  clearEditorAfterAdd?: boolean
}> = ({ item, onSelectEntry, canToggleCart, clearEditorAfterAdd }) => {
  const dispatch = useAppDispatch()
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const { displayUrl, onPreviewImgError } = useListCardPreviewUrl(
    item.cardId,
    item.previewUrl,
    { previewIsProcessed: item.previewIsProcessed },
  )

  const handleToggleCart = useCallback(() => {
    if (!item.dispatchBranchKey) return
    if (!cartListPanelOpen) {
      dispatch(setCartListPanelOpen(true))
    }
    dispatch(
      toggleCartForDispatchBranch({
        branchKey: item.dispatchBranchKey,
        clearEditorAfterAdd,
      }),
    )
  }, [cartListPanelOpen, clearEditorAfterAdd, dispatch, item.dispatchBranchKey])

  const onAddCartFromList =
    canToggleCart && item.dispatchBranchKey ? handleToggleCart : undefined
  const onDeleteFromList = item.onDelete

  return (
    <CardPieListEntry
      key={item.id}
      dateLabel={item.dateLabel}
      previewUrl={displayUrl}
      onPreviewImgError={onPreviewImgError}
      detailLine={item.detailLine}
      priceLine={item.priceLine}
      variant={item.variant}
      onSelect={
        onSelectEntry && item.variant !== 'inactive'
          ? () => onSelectEntry(item)
          : undefined
      }
      onAddCart={onAddCartFromList}
      onDelete={onDeleteFromList}
    />
  )
}

export const CardPiePanel: React.FC<Props> = ({
  onClose,
  entries = [],
  onSelectEntry,
}) => {
  const dispatch = useAppDispatch()
  const { isAllComplete, progress: pieProgress } = useAppSelector(selectPieProgress)
  const { setCartListPanelOpen } = useCartFacade()

  const hasRows = entries.length > 0
  const canClearWorkspace = hasRows || pieProgress > 0
  const listContentKey = entries.map((e) => e.id).join('|')

  /** Как `CardPieListEntry` addCart: `disabled={!onAddCart || inactive}`. */
  const addCartListEnabled = useMemo(
    () =>
      entries.some(
        (item) =>
          isAllComplete &&
          Boolean(item.dispatchBranchKey) &&
          item.variant !== 'inactive',
      ),
    [entries, isAllComplete],
  )

  const handleHeaderOpenCart = useCallback(() => {
    setCartListPanelOpen(true)
  }, [setCartListPanelOpen])

  const handleHeaderClearWorkspace = useCallback(() => {
    dispatch(clearCardPieEditorSession())
  }, [dispatch])

  const toolbarStateOverride = useMemo(
    () => ({
      addCartList: {
        state: addCartListEnabled ? 'enabled' : 'disabled',
        options: {},
      },
      listDelete: {
        state: canClearWorkspace ? 'enabled' : 'disabled',
        options: {},
      },
    }),
    [addCartListEnabled, canClearWorkspace],
  )

  const handleToolbarActionClick = useCallback(
    (key: IconKey) => {
      if (key === 'addCartList') {
        if (addCartListEnabled) handleHeaderOpenCart()
        return false
      }
      if (key === 'listDelete') {
        if (canClearWorkspace) handleHeaderClearWorkspace()
        return false
      }
    },
    [
      addCartListEnabled,
      canClearWorkspace,
      handleHeaderClearWorkspace,
      handleHeaderOpenCart,
    ],
  )

  return (
    <div
      className={clsx(styles.panel, !hasRows && styles.panelEmptyNoToolbar)}
    >
      <ListPanelStackedHeader
        leadIconKey="cardPie"
        toolbar={
          hasRows ? (
            <Toolbar
              section="cardPieList"
              stateOverride={toolbarStateOverride}
              onActionClick={handleToolbarActionClick}
            />
          ) : (
            false
          )
        }
        showDividerWithoutToolbar={!hasRows}
        onClose={onClose}
        closeAriaLabel="Close card pie list"
      />
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
                clearEditorAfterAdd={entries.length === 1}
              />
            ))
          ) : (
            <div className={styles.listEmpty} aria-hidden>
              <IconCardPie className={styles.listEmptyIcon} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
