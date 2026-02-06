import React from 'react'
import clsx from 'clsx'
import { capitalize } from '@/shared/utils/helpers'
import { i18n } from '@i18n/i18n'
import { getSafeLang } from '@i18n/helpers'
import { useEnvelopeAddress } from '@envelope/addressForm/application/hooks'
import styles from './MiniAddress.module.scss'
import type {
  AddressFields,
  EnvelopeRoleLabel,
  EnvelopeRole,
} from '@shared/config/constants'

interface MiniAddressProps {
  role: EnvelopeRole
  roleLabel: EnvelopeRoleLabel
  value: AddressFields
}

export const MiniAddress: React.FC<MiniAddressProps> = ({
  role,
  roleLabel,
  value,
}) => {
  // const lang = getSafeLang(i18n.language)
  // const { labelLayout } = useEnvelopeAddress(role, lang)

  return (
    <div
      className={clsx(styles.miniAddress, styles[`miniAddress${roleLabel}`])}
    >
      <div className={clsx(styles.miniAddressField, styles.miniAddressName)}>
        {value.name}
      </div>
      <div className={clsx(styles.miniAddressField, styles.miniAddressCity)}>
        {value.city}
      </div>
      <div className={clsx(styles.miniAddressField, styles.miniAddressCountry)}>
        {value.country}
      </div>
    </div>
  )
}
