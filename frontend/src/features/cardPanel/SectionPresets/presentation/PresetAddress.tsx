import React from 'react'
import styles from './SectionPresets.module.scss'
import { PresetSource } from '../domain/types'
import { trimLines } from '../application/helpers/trimLines'

interface Props {
  name: string
  country: string
  section: PresetSource
  spanRef?: (el: HTMLElement | null) => void
}

export const PresetAddress: React.FC<Props> = ({
  name,
  country,
  section,
  spanRef,
}) => {
  return (
    <span className={styles['section-presets__address']}>
      {section === 'toaddress' && (
        <>
          <span
            className={styles['section-presets__name--toaddress']}
            ref={spanRef}
          >
            {trimLines(section, name)}
          </span>
          <span className={styles['section-presets__country--toaddress']}>
            {country}
          </span>
        </>
      )}
      {section === 'myaddress' && (
        <>
          <span className={styles['section-presets__country--myaddress']}>
            {country}
          </span>
          <span className={styles['section-presets__name--myaddress']}>
            {trimLines(section, name)}
          </span>
        </>
      )}
    </span>
  )
}
