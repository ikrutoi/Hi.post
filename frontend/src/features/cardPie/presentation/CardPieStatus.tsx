import React from 'react'
import clsx from 'clsx'
import { getToolbarIcon } from '@shared/utils/icons'
import styles from './CardPieStatus.module.scss'

export const CardPieStatus: React.FC<{
  isRainbowActive: boolean
  isRainbowStopping: boolean
}> = ({ isRainbowActive, isRainbowStopping }) => {
  return (
    <div
      className={clsx(styles.pieStatus, {
        [styles.completed]: isRainbowActive,
      })}
      // onClick={handleClick}
    >
      <span
        className={clsx(
          styles.pieStatusIcon,
          isRainbowActive && !isRainbowStopping && styles.completed,
        )}
      >
        {getToolbarIcon({ key: 'addCart' })}
      </span>
    </div>
  )
}
