import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IconListCardphoto } from '@shared/ui/icons'
import styles from './CardphotoPreviewEmptyGrid.module.scss'

export const CardphotoPreviewEmptyGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null)

  const MIN_CELL_REM = 2.7
  const GAP_REM = 0.5
  const MIN_COLS = 2
  const MAX_COLS = 6
  const DEFAULT_COLS = 4

  const [cols, setCols] = useState<number>(DEFAULT_COLS)

  const computeCols = useMemo(() => {
    const getRootFontPx = () => {
      if (typeof window === 'undefined') return 16
      const px = parseFloat(getComputedStyle(document.documentElement).fontSize)
      return Number.isFinite(px) && px > 0 ? px : 16
    }

    return (widthPx: number) => {
      const rootFontPx = getRootFontPx()
      const minCellPx = MIN_CELL_REM * rootFontPx
      const gapPx = GAP_REM * rootFontPx

      // width + gap ~= cols * (minCell + gap)  (derived from grid math)
      const next = Math.floor((widthPx + gapPx) / (minCellPx + gapPx))
      return Math.min(MAX_COLS, Math.max(MIN_COLS, next))
    }
  }, [])

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const update = () => {
      const width = el.getBoundingClientRect().width
      if (!Number.isFinite(width) || width <= 0) return
      const next = computeCols(width)
      setCols((prev) => (prev === next ? prev : next))
    }

    update()

    const ro = new ResizeObserver(() => update())
    ro.observe(el)

    return () => ro.disconnect()
  }, [computeCols])

  return (
    <div
      ref={gridRef}
      className={styles.grid}
      aria-hidden
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {Array.from({ length: cols }).map((_, idx) => (
        <div key={idx} className={styles.cell} role="presentation">
          <div className={styles.iconBg}>
            <IconListCardphoto />
          </div>
        </div>
      ))}
    </div>
  )
}

