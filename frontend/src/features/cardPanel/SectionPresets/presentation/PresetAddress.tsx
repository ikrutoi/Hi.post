import React from 'react'
import styles from './SectionPresets.module.scss'
import type { Template } from '@shared/config/constants'
import { trimLines } from '../application/helpers/trimLines'

interface Props {
  name: string
  country: string
  template: Template
  spanRef?: (el: HTMLElement | null) => void
}

export const PresetAddress: React.FC<Props> = ({
  name,
  country,
  template,
  spanRef,
}) => {
  return (
    <span className={styles['template-presets__address']}>
      {template === 'recipient' && (
        <>
          <span
            className={styles['template-presets__name--recipient']}
            ref={spanRef}
          >
            {trimLines(template, name)}
          </span>
          <span className={styles['template-presets__country--recipient']}>
            {country}
          </span>
        </>
      )}
      {template === 'sender' && (
        <>
          <span className={styles['template-presets__country--sender']}>
            {country}
          </span>
          <span className={styles['template-presets__name--sender']}>
            {trimLines(template, name)}
          </span>
        </>
      )}
    </span>
  )
}
