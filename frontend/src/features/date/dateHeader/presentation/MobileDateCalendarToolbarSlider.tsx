import React from 'react'
import { Slider } from '../../slider/presentation/Slider'
import styles from './MobileDateCalendarToolbarSlider.module.scss'

export const MobileDateCalendarToolbarSlider: React.FC = () => (
  <div className={styles.root}>
    <Slider variant="toolbar" />
  </div>
)
