import React from 'react'
import clsx from 'clsx'
import { ENVELOPE_ROLE_LABELLED } from '@shared/config/constants'
import { Mark } from '@envelope/view/presentation'
import { getSafeLang } from '@i18n/helpers'
import { i18n } from '@i18n/i18n'
import { EnvelopeAddress } from '../addressForm/presentation'
import styles from './Envelope.module.scss'

type EnvelopeProps = {
  cardPuzzleRef: React.RefObject<HTMLDivElement | null>
}

export const Envelope: React.FC<EnvelopeProps> = ({ cardPuzzleRef }) => {
  const lang = getSafeLang(i18n.language)

  return (
    <div className={styles.envelope}>
      <div className={styles.envelopeLogo} />
      {ENVELOPE_ROLE_LABELLED.map(({ key: role, label }) => (
        <div
          key={role}
          className={clsx(
            styles.envelopeSection,
            styles[`envelopeSection${label}`]
          )}
        >
          <EnvelopeAddress role={role} roleLabel={label} lang={lang} />
        </div>
      ))}
      <Mark />
    </div>
  )
}
