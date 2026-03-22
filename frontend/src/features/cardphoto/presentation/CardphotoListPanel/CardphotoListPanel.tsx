import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IconX, IconListCardphoto } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { useAppSelector } from '@app/hooks'
import {
  selectCardphotoInlineTemplateListRevision,
  selectCardphotoListTemplateGridCols,
} from '@cardphoto/infrastructure/selectors'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { ImageMeta } from '@cardphoto/domain/types'
import styles from './CardphotoListPanel.module.scss'

type Props = {
  onClose: () => void
}

type Row = { id: string; src: string }

/** Сначала Blob из IndexedDB — сохранённые `blob:` в url часто уже отозваны и не грузятся. */
function buildThumbSrc(meta: ImageMeta): { src: string; revoke: boolean } {
  if (meta.thumbnail?.blob instanceof Blob) {
    return { src: URL.createObjectURL(meta.thumbnail.blob), revoke: true }
  }
  if (meta.full?.blob instanceof Blob) {
    return { src: URL.createObjectURL(meta.full.blob), revoke: true }
  }
  if (meta.thumbnail?.url) {
    return { src: meta.thumbnail.url, revoke: false }
  }
  if (meta.url) {
    return { src: meta.url, revoke: false }
  }
  if (meta.full?.url) {
    return { src: meta.full.url, revoke: false }
  }
  return { src: '', revoke: false }
}

const MIN_CELL_PX = 28

function remToPx(rem: number): number {
  const root = document.documentElement
  const fs = parseFloat(getComputedStyle(root).fontSize || '16')
  return rem * (Number.isFinite(fs) ? fs : 16)
}

export const CardphotoListPanel: React.FC<Props> = ({ onClose }) => {
  const listRevision = useAppSelector(selectCardphotoInlineTemplateListRevision)
  const columns = useAppSelector(selectCardphotoListTemplateGridCols)
  const [rows, setRows] = useState<Row[]>([])
  const objectUrlsRef = useRef<string[]>([])

  const listContentRef = useRef<HTMLDivElement | null>(null)
  const thumbGridRef = useRef<HTMLDivElement | null>(null)
  const [cellPx, setCellPx] = useState(56)

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
  }, [rows.length, columns])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const all = await storeAdapters.cardphotoImages.getAll()
      if (cancelled) return

      const inline = all
        .filter((x) => x.status === 'inLine')
        .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))

      const nextRows: Row[] = []
      const created: string[] = []

      for (const meta of inline) {
        const { src, revoke } = buildThumbSrc(meta)
        if (!src) continue
        if (revoke) created.push(src)
        nextRows.push({ id: meta.id, src })
      }

      if (cancelled) {
        created.forEach((u) => URL.revokeObjectURL(u))
        return
      }

      const prevRevoke = objectUrlsRef.current
      objectUrlsRef.current = created
      setRows(nextRows)
      prevRevoke.forEach((u) => URL.revokeObjectURL(u))
    })()

    return () => {
      cancelled = true
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u))
      objectUrlsRef.current = []
    }
  }, [listRevision])

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerToolbar}>
          <Toolbar section="cardphotoList" />
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close photo templates list"
        >
          <IconX />
        </button>
      </div>

      <div className={styles.panelScrollTrack} aria-hidden />

      <ScrollArea className={styles.listScrollArea}>
        <div
          className={styles.list}
          tabIndex={0}
          aria-label="Cardphoto templates list"
        >
          <div ref={listContentRef} className={styles.listContent}>
            {rows.length === 0 ? (
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
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className={styles.thumbCell}
                    style={{
                      width: cellPx,
                      height: cellPx,
                    }}
                  >
                    <img
                      className={styles.thumbImg}
                      src={row.src}
                      alt=""
                      width={cellPx}
                      height={cellPx}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
