import React from 'react'
import clsx from 'clsx'
import { IconDelete } from '@shared/ui/icons'
import styles from './CardphotoListThumb.module.scss'

type Props = {
  id: string
  src: string
  cellPx: number
  favorite: boolean
  onFavorite: () => void | Promise<void>
  onDelete: () => void | Promise<void>
}

function btnSize(cell: number) {
  return Math.min(22, Math.max(17, Math.round(cell * 0.32)))
}

function iconSize(cell: number) {
  return Math.min(12, Math.max(9, Math.round(cell * 0.18)))
}

function starShiftPx(cell: number) {
  // Keep baseline position for largest previews; shift as cells get smaller.
  const maxCell = 96
  const minCell = 28
  const clamped = Math.max(minCell, Math.min(maxCell, cell))
  const t = (maxCell - clamped) / (maxCell - minCell)
  return Math.round(t * 6)
}

export const CardphotoListThumb: React.FC<Props> = ({
  id,
  src,
  cellPx,
  favorite,
  onFavorite,
  onDelete,
}) => {
  const bp = btnSize(cellPx)
  const ip = iconSize(cellPx)
  const actionBtnStyle: React.CSSProperties = {
    width: bp,
    height: bp,
    minWidth: bp,
    minHeight: bp,
  }
  const iconStyle: React.CSSProperties = { width: ip, height: ip }
  const shift = starShiftPx(cellPx)
  const starStyle: React.CSSProperties = {
    transform: `translate(${-shift}px, ${-shift}px)`,
  }

  const runFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    void Promise.resolve(onFavorite())
  }

  const runDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    void Promise.resolve(onDelete())
  }

  return (
    <div
      className={styles.thumbCell}
      data-cardphoto-thumb={id}
      style={{ width: cellPx, height: cellPx }}
    >
      <img
        className={styles.thumbImg}
        src={src}
        alt=""
        width={cellPx}
        height={cellPx}
        decoding="async"
      />
      <div className={styles.thumbOverlay}>
        <button
          type="button"
          className={clsx(styles.thumbActionBtn, styles.thumbActionDelete)}
          style={actionBtnStyle}
          onClick={runDelete}
          aria-label="Delete template"
          title="Delete"
        >
          <IconDelete style={iconStyle} />
        </button>
      </div>
      <button
        type="button"
        className={styles.thumbStar}
        style={starStyle}
        data-starred={favorite ? 'true' : undefined}
        onClick={runFavorite}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        title={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        ★
      </button>
    </div>
  )
}
