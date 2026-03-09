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
  const isSelected =
    selectedAroma?.make === aromaItem.make &&
    selectedAroma?.name === aromaItem.name

  const handleClick = () => {
    onSelectAroma(aromaItem)
  }

  return (
    <button
      className={clsx(styles.tile, { [styles.tileSelected]: isSelected })}
      type="submit"
      onClick={handleClick}
    >
      <span className={styles.tileLabelWrap}>
        <span className={styles.tileMake}>
          {aromaItem.make === '0' ? 'No Aroma' : aromaItem.make}
        </span>
        <span className={styles.tileName}>
          {aromaItem.make === '0' ? 'No Aroma' : aromaItem.name}
        </span>
      </span>
      <span className={styles.tileImageWrap}>
        <img
          className={styles.tileImage}
          alt={aromaItem.name}
          src={imageSrc}
        />
      </span>
    </button>
  )
}
