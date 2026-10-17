import React from 'react'
import styles from './CardphotoListThumb.module.scss'

type Props = {
  id: string
  src: string
  title?: string
  cellPx: number
  onSelect: () => void | Promise<void>
  isSelected?: boolean
}

export const CardphotoListThumb: React.FC<Props> = ({
  id,
  src,
  title,
  cellPx,
  onSelect,
  isSelected = false,
}) => {
  const cellStyle = {
    width: cellPx,
    height: cellPx,
  } as React.CSSProperties

  const runSelect = () => {
    void Promise.resolve(onSelect())
  }

  const titleLabel = title?.trim()

  return (
    <div
      className={styles.thumbCell}
      data-cardphoto-thumb={id}
      data-selected={isSelected ? 'true' : undefined}
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
      {titleLabel ? (
        <span className={styles.titleBadge} title={titleLabel} aria-hidden>
          {titleLabel}
        </span>
      ) : null}
    </div>
  )
}
