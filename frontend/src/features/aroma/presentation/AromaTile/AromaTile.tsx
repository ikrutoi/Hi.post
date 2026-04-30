import React from 'react'
import clsx from 'clsx'
import { getAromaImage } from '@entities/aroma/mappers/aromaImageMap'
import styles from './AromaTile.module.scss'
import type { AromaTileProps } from '../../domain/types'

export const AromaTile: React.FC<AromaTileProps> = ({
  selectedAroma,
  aromaItem,
  onSelectAroma,
}) => {
  const imageSrc = getAromaImage(aromaItem.index)
  const isSelected = selectedAroma?.index === aromaItem.index

  const handleClick = () => {
    onSelectAroma(aromaItem)
  }

  const label =
    aromaItem.index === 0 ? 'No aroma' : `Aroma slot ${aromaItem.index}`

  return (
    <button
      className={clsx(styles.tile, { [styles.tileSelected]: isSelected })}
      type="button"
      onClick={handleClick}
      aria-label={label}
    >
      <span className={styles.tileImageWrap}>
        {imageSrc ? (
          <img
            className={styles.tileImage}
            alt=""
            draggable={false}
            src={imageSrc}
          />
        ) : null}
      </span>
    </button>
  )
}
