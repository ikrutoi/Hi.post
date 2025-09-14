import React from 'react'
import listColors from '@shared/data/toolbar/listColors.json'
import { TooltipColorProps } from '../../ui/TooltipColor/TooltipColor.types'
import { useTooltipPosition } from '../application/useTooltipPosition'
import styles from './TooltipColor.module.scss'

export const TooltipColor: React.FC<TooltipColorProps> = ({
  remSize,
  setBtnColor,
  infoButtonsCardtext,
  onSelectColor,
  styleLeft,
}) => {
  const { ref, left, visible } = useTooltipPosition(styleLeft, remSize)

  const handleClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const { colorName, colorType } = evt.currentTarget.dataset
    if (colorName && colorType) {
      onSelectColor(colorName, colorType)
    }
  }

  return (
    <div
      ref={ref}
      className={styles.tooltip}
      style={{ left: `${left}px`, visibility: visible }}
    >
      {listColors.map((color, i) => (
        <button
          key={`${i}-${color.name}`}
          className={`${styles.color} ${styles[`color_${color.name}`]}`}
          style={{ backgroundColor: color.code }}
          data-color-name={color.name}
          data-color-type={color.code}
          onClick={handleClick}
        />
      ))}
    </div>
  )
}
