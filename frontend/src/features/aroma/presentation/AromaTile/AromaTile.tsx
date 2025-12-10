import React from 'react'
import clsx from 'clsx'
import { getAromaImage } from '@entities/aroma/mappers/aromaImageMap'
import { useLayoutFacade } from '@layout/application/facades'
import styles from './AromaTile.module.scss'
import type { AromaTileProps } from '../../domain/types'

export const AromaTile: React.FC<AromaTileProps> = ({
  selectedAroma,
  aromaItem,
  onSelectAroma,
}) => {
  const { size } = useLayoutFacade()
  const { sizeMiniCard } = size

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
      style={{
        width: `${sizeMiniCard.width}px`,
        height: `${sizeMiniCard.height}px`,
      }}
      onClick={handleClick}
    >
      <span className={styles.tileMake}>
        {aromaItem.make === '0' ? '\u00A0' : aromaItem.make}
      </span>
      <img
        className={styles.tileImage}
        alt={aromaItem.name}
        style={{ height: `${0.6 * sizeMiniCard.height}px` }}
        src={imageSrc}
      />
      <span className={styles.tileName}>{aromaItem.name}</span>
    </button>
  )
}
