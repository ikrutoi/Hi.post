import React from 'react'
import { IconDelete } from '@shared/ui/icons'
import styles from './CardphotoListThumb.module.scss'

type Props = {
  id: string
  src: string
  cellPx: number
  onDelete: () => void | Promise<void>
  onSelect: () => void | Promise<void>
}

function btnSize(cell: number) {
  return Math.min(22, Math.max(17, Math.round(cell * 0.32)))
}

function iconSize(cell: number) {
  return Math.min(12, Math.max(9, Math.round(cell * 0.18)))
}

export const CardphotoListThumb: React.FC<Props> = ({
  id,
  src,
  cellPx,
  onDelete,
  onSelect,
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

  const runDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    void Promise.resolve(onDelete())
  }

  const runSelect = () => {
    void Promise.resolve(onSelect())
  }

  return (
    <div
      className={styles.thumbCell}
      data-cardphoto-thumb={id}
      style={{ width: cellPx, height: cellPx }}
      onClick={runSelect}
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
          className={styles.thumbActionBtn}
          style={actionBtnStyle}
          onClick={runDelete}
          aria-label="Delete template"
          title="Delete"
        >
          <IconDelete style={iconStyle} />
        </button>
      </div>
    </div>
  )
}
