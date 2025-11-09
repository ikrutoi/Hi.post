import React from 'react'
import { getAromaImage } from '@entities/aroma/mappers/aromaImageMap'
import { useLayoutFacade } from '@layout/application/facades'
import type { AromaTileProps } from '../../domain/types'
import styles from './AromaTile.module.scss'

export const AromaTile: React.FC<AromaTileProps> = ({
  selectedAroma,
  aromaItem,
  selectAroma,
}) => {
  const { size } = useLayoutFacade()
  const { sizeMiniCard } = size

  const imageSrc = getAromaImage(aromaItem.index)
  const isSelected =
    selectedAroma?.make === aromaItem.make &&
    selectedAroma?.name === aromaItem.name

  const handleClick = () => {
    selectAroma(aromaItem)
  }

  return (
    <button
      className={`${styles.tile} ${isSelected ? styles['tile--selected'] : ''}`}
      type="submit"
      style={{
        width: `${sizeMiniCard.width}px`,
        height: `${sizeMiniCard.height}px`,
      }}
      onClick={handleClick}
    >
      <span className={styles['tile__make']}>
        {aromaItem.make === '0' ? '\u00A0' : aromaItem.make}
      </span>
      <img
        className={styles['tile__image']}
        alt={aromaItem.name}
        style={{ height: `${0.6 * sizeMiniCard.height}px` }}
        src={imageSrc}
      />
      <span className={styles['tile__name']}>{aromaItem.name}</span>
    </button>
  )
}
