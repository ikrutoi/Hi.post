import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { IconListCardtext } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import {
  ListPanelCornerReturn,
  listPanelCornerReturnPanelProps,
} from '@shared/ui/ListPanelCornerReturn/ListPanelCornerReturn'
import { selectCardtextAssetStatus } from '@cardtext/infrastructure/selectors'
import {
  selectCardtextTemplatesListItems,
  selectCardtextTemplatesListLoading,
  selectCardtextId,
  selectCardtextListPanelDensity,
  selectCardtextListSortDirection,
} from '@cardtext/infrastructure/selectors'
import {
  setCardtextTemplatesListSelectedId,
  clearCardtextTemplatesListSelection,
} from '@cardtext/infrastructure/state'
import type { CardtextContent } from '@cardtext/domain/types'
import { getCardtextTemplateDisplayTitle } from '@cardtext/application/helpers'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { CardtextListEntry } from './CardtextListEntry'
import clsx from 'clsx'
import styles from './CardtextListPanel.module.scss'

type Props = {
  onClose: () => void
  onSelect?: (entry: CardtextContent) => void
  /** Mobile factory: toolbars live in shell, not in panel header. */
  factoryChrome?: boolean
}

function sortTemplatesByTitle(
  list: CardtextContent[],
  direction: 'asc' | 'desc',
): CardtextContent[] {
  const sorted = [...list].sort((a, b) =>
    getCardtextTemplateDisplayTitle(a).localeCompare(
      getCardtextTemplateDisplayTitle(b),
      undefined,
      { sensitivity: 'base' },
    ),
  )
  return direction === 'desc' ? sorted.reverse() : sorted
}

export const CardtextListPanel: React.FC<Props> = ({
  onClose,
  onSelect,
  factoryChrome = false,
}) => {
  const dispatch = useAppDispatch()
  const { isMobileLayout } = useSizeFacade()
  const useFactoryChrome = factoryChrome && isMobileLayout
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
  const templatesListSelectedId = useAppSelector(
    (state) => state.cardtext.templatesListSelectedId,
  )

  const highlightAssetTemplateInList =
    cardtextAssetStatus === 'inLine' || cardtextAssetStatus === 'outLine'

  const listHighlightId =
    cardtextAssetStatus !== 'processed' &&
    highlightAssetTemplateInList &&
    selectedTemplateId != null
      ? selectedTemplateId
      : templatesListSelectedId

  const handleSelect = useCallback(
    (entry: CardtextContent) => {
      if (entry.id != null) {
        dispatch(setCardtextTemplatesListSelectedId(String(entry.id)))
      } else {
        dispatch(clearCardtextTemplatesListSelection())
      }
      onSelect?.(entry)
    },
    [dispatch, onSelect],
  )

  const hasRows = sortedTemplates.length > 0

  return (
    <div
      className={clsx(
        styles.panel,
        !hasRows && styles.panelEmptyNoToolbar,
        useFactoryChrome && styles.panelFactoryChrome,
      )}
      {...(useFactoryChrome ? {} : listPanelCornerReturnPanelProps(isMobileLayout))}
    >
      {!useFactoryChrome ? (
        <ListPanelStackedHeader
          leadIconKey="listCardtext"
          variant="sectionToolbar"
          cardPieListHeaderIcons
          toolbar={hasRows ? <Toolbar section="cardtextList" /> : false}
          showDividerWithoutToolbar={!hasRows}
          hideClose={isMobileLayout}
          onClose={onClose}
          closeAriaLabel="Close text templates list"
        />
      ) : null}
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
                  isSelected={
                    entry.id != null &&
                    listHighlightId != null &&
                    String(entry.id) === String(listHighlightId)
                  }
                  density={panelDensity}
                />
              </div>
            ))}
        </div>
      </ScrollArea>
      {!useFactoryChrome ? (
        <ListPanelCornerReturn
          onClick={onClose}
          ariaLabel="Return to cardtext section"
        />
      ) : null}
    </div>
  )
}
