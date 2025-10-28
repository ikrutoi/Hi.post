import React from 'react'
import { getAromaImage } from '@entities/aroma/mappers/aromaImageMap'
import type { AromaTileProps } from '../../domain/types'
import styles from './AromaTile.module.scss'

export const AromaTile: React.FC<AromaTileProps> = ({
  selectedAroma,
  elementAroma,
  setSelectedAroma,
  tileSize,
}) => {
  if (!tileSize) return null

  const imageSrc = getAromaImage(elementAroma.index)
  const isSelected =
    selectedAroma?.make === elementAroma.make &&
    selectedAroma?.name === elementAroma.name

  const handleClick = () => {
    setSelectedAroma(elementAroma)
  }

  return (
    <button
      className={`${styles.tile} ${isSelected ? styles['tile--selected'] : ''}`}
      type="submit"
      style={{
        width: `${tileSize.width}px`,
        height: `${tileSize.height}px`,
      }}
      onClick={handleClick}
    >
      <span className={styles['tile__make']}>
        {elementAroma.make === '0' ? '\u00A0' : elementAroma.make}
      </span>
      <img
        className={styles['tile__image']}
        alt={elementAroma.name}
        style={{ height: `${0.6 * tileSize.height}px` }}
        src={imageSrc}
      />
      <span className={styles['tile__name']}>{elementAroma.name}</span>
    </button>
  )
}
