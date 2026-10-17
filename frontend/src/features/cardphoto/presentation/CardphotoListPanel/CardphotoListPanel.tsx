import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { IconListCardphoto } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  peekCardphotoListThumbSrc,
  resolveCardphotoListThumbSrc,
  retainCardphotoListThumbCache,
} from '@cardphoto/application/helpers/cardphotoListThumbCache'
import { useAppSelector } from '@app/hooks'
import {
  selectCardphotoInlineTemplateListRevision,
  selectCardphotoListHighlightTemplateId,
  selectCardphotoListTemplateGridCols,
} from '@cardphoto/infrastructure/selectors'
import { useCardphotoListSort } from '@cardphoto/application/hooks/useCardphotoListSort'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import type { ImageMeta } from '@cardphoto/domain/types'
import { CardphotoListThumb } from './CardphotoListThumb'
import { CardphotoListMobileFactoryUpperToolbar } from '../CardphotoListMobileFactoryToolbar'
import styles from './CardphotoListPanel.module.scss'
import clsx from 'clsx'

type Props = {
  onClose: () => void
  onSelectTemplate: (id: string) => void | Promise<void>
  /** Mobile factory: toolbars live in shell, not in panel header. */
  factoryChrome?: boolean
}

type Row = {
  id: string
  src: string
  title?: string
  timestamp: number
}

function rowFrom(meta: ImageMeta, src: string): Row {
  return {
    id: meta.id,
    src,
    title: meta.title?.trim() || undefined,
    timestamp: meta.timestamp ?? 0,
  }
}

const MIN_CELL_PX = 28

function remToPx(rem: number): number {
  const root = document.documentElement
  const fs = parseFloat(getComputedStyle(root).fontSize || '16')
  return rem * (Number.isFinite(fs) ? fs : 16)
}

export const CardphotoListPanel: React.FC<Props> = ({
  onClose,
  onSelectTemplate,
  factoryChrome = false,
}) => {
  const listRevision = useAppSelector(selectCardphotoInlineTemplateListRevision)
  const listHighlightId = useAppSelector(selectCardphotoListHighlightTemplateId)
  const columns = useAppSelector(selectCardphotoListTemplateGridCols)
  const [rows, setRows] = useState<Row[]>([])

  const listContentRef = useRef<HTMLDivElement | null>(null)
  const thumbGridRef = useRef<HTMLDivElement | null>(null)
  const [cellPx, setCellPx] = useState(56)

  const sortedRows = useCardphotoListSort(rows)
  const { isMobileLayout } = useSizeFacade()
  const useFactoryChrome = factoryChrome && isMobileLayout

  useLayoutEffect(() => {
    const contentEl = listContentRef.current
    if (!contentEl) return

    const update = () => {
      const w = contentEl.clientWidth
      if (!Number.isFinite(w) || w <= 1) return
      const gridEl = thumbGridRef.current
      const gapPx = gridEl
        ? parseFloat(getComputedStyle(gridEl).columnGap)
        : remToPx(0.5)
      const gap = Number.isFinite(gapPx) ? gapPx : remToPx(0.5)
      const cell = Math.floor((w - (columns - 1) * gap) / columns)
      setCellPx(Math.max(MIN_CELL_PX, cell))
    }

    update()
    const ro = new ResizeObserver(() => update())
    ro.observe(contentEl)
    return () => ro.disconnect()
  }, [sortedRows.length, columns])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const all = await storeAdapters.cardphotoImages.getAll()
      if (cancelled) return

      const inline = all.filter((x) => x.status === 'inLine')
      const nextRows: Row[] = []
      const pending: ImageMeta[] = []

      for (const meta of inline) {
        const src = peekCardphotoListThumbSrc(meta.id)
        if (src) nextRows.push(rowFrom(meta, src))
        else pending.push(meta)
      }

      if (!cancelled) setRows(nextRows)

      for (const meta of pending) {
        if (cancelled) return
        try {
          const src = await resolveCardphotoListThumbSrc(meta)
          if (!src || cancelled) continue
          nextRows.push(rowFrom(meta, src))
          setRows([...nextRows])
        } catch (e) {
          console.error('CardphotoListPanel: skip template', meta.id, e)
        }
      }

      if (cancelled) return
      retainCardphotoListThumbCache(new Set(inline.map((meta) => meta.id)))
    })()

    return () => {
      cancelled = true
    }
  }, [listRevision])

  const hasRows = sortedRows.length > 0

  return (
    <div
      className={clsx(
        styles.panel,
        !hasRows && styles.panelEmptyNoToolbar,
        useFactoryChrome && styles.panelFactoryChrome,
      )}
    >
      {!useFactoryChrome ? (
        <ListPanelStackedHeader
          leadIconKey="listCardphoto"
          variant="sectionToolbar"
          cardPieListHeaderIcons
          headerFade="cardphoto"
          headerTopRow={
            !isMobileLayout ? (
              <CardphotoListMobileFactoryUpperToolbar placement="listHeader" />
            ) : null
          }
          toolbar={hasRows ? <Toolbar section="cardphotoList" /> : false}
          showDividerWithoutToolbar={!hasRows}
          hideClose={isMobileLayout}
          onClose={onClose}
          closeAriaLabel="Close photo templates list"
        />
      ) : null}

      <div className={styles.panelScrollTrack} aria-hidden />

      <ScrollArea className={styles.listScrollArea}>
        <div
          className={styles.list}
          tabIndex={0}
          aria-label="Cardphoto templates list"
        >
          <div ref={listContentRef} className={styles.listContent}>
            {sortedRows.length === 0 ? (
              <div className={styles.listEmpty} aria-hidden>
                <IconListCardphoto className={styles.listEmptyIcon} />
              </div>
            ) : (
              <div
                ref={thumbGridRef}
                className={styles.thumbGrid}
                style={{
                  gridTemplateColumns: `repeat(${columns}, ${cellPx}px)`,
                }}
              >
                {sortedRows.map((row) => (
                  <CardphotoListThumb
                    key={row.id}
                    id={row.id}
                    src={row.src}
                    title={row.title}
                    cellPx={cellPx}
                    onSelect={() => onSelectTemplate(row.id)}
                    isSelected={
                      listHighlightId != null && row.id === listHighlightId
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
