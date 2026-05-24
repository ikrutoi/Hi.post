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
  const cellStyle = {
    width: cellPx,
    height: cellPx,
    '--thumb-action-size': `${bp}px`,
    '--thumb-icon-size': `${ip}px`,
  } as React.CSSProperties

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
      style={cellStyle}
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
      <button
        type="button"
        className={styles.thumbDeleteBtn}
        onClick={runDelete}
        aria-label="Delete template"
        title="Delete"
      >
        <IconDelete />
      </button>
    </div>
  )
}
