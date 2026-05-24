import React from 'react'
import styles from './CardphotoListThumb.module.scss'

type Props = {
  id: string
  src: string
  cellPx: number
  onSelect: () => void | Promise<void>
}

export const CardphotoListThumb: React.FC<Props> = ({
  id,
  src,
  cellPx,
  onSelect,
}) => {
  const cellStyle = {
    width: cellPx,
    height: cellPx,
  } as React.CSSProperties

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
    </div>
  )
}
