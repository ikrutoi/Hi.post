import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IconX, IconListCardphoto } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { useAppSelector } from '@app/hooks'
import { selectCardphotoInlineTemplateListRevision } from '@cardphoto/infrastructure/selectors'
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

const COLUMNS = 5
const GAP_PX = 8
const MIN_CELL_PX = 28

export const CardphotoListPanel: React.FC<Props> = ({ onClose }) => {
  const listRevision = useAppSelector(selectCardphotoInlineTemplateListRevision)
  const [rows, setRows] = useState<Row[]>([])
  const objectUrlsRef = useRef<string[]>([])

  const listMeasureRef = useRef<HTMLDivElement | null>(null)
  const [cellPx, setCellPx] = useState(56)

  useLayoutEffect(() => {
    const el = listMeasureRef.current
    if (!el) return

    const update = () => {
      const w = el.clientWidth
      if (!Number.isFinite(w) || w <= 1) return
      const cell = Math.floor((w - (COLUMNS - 1) * GAP_PX) / COLUMNS)
      setCellPx(Math.max(MIN_CELL_PX, cell))
    }

    update()
    const ro = new ResizeObserver(() => update())
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

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
        <div className={styles.headerToolbar} />
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
          ref={listMeasureRef}
          className={styles.list}
          tabIndex={0}
          aria-label="Cardphoto templates list"
        >
          {rows.length === 0 ? (
            <div className={styles.listEmpty} aria-hidden>
              <IconListCardphoto className={styles.listEmptyIcon} />
            </div>
          ) : (
            <div
              className={styles.thumbGrid}
              style={{
                gridTemplateColumns: `repeat(${COLUMNS}, ${cellPx}px)`,
                gap: `${GAP_PX}px`,
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
      </ScrollArea>
    </div>
  )
}
