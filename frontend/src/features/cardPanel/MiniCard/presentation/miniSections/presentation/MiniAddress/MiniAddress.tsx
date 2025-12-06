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
  const lang = getSafeLang(i18n.language)
  const { labelLayout } = useEnvelopeAddress(role, lang)

  return (
    <div
      className={clsx(styles.miniAddress, styles[`miniAddress${roleLabel}`])}
    >
      <div className={styles.miniAddress}>
        {labelLayout.flatMap((item, i) => {
          if (Array.isArray(item)) {
            return (
              <div
                key={`group-${i}`}
                className={clsx(
                  styles.miniAddressGroup,
                  styles[`miniAddressGroup${roleLabel}`]
                )}
              >
                {item.map((subItem, j) => {
                  return (
                    <div
                      className={clsx(
                        styles.miniAddressField,
                        styles[`miniAddressField${capitalize(subItem.key)}`]
                      )}
                      key={`${subItem.key}-${i}-${j}`}
                    >
                      {value[subItem.key]}
                    </div>
                  )
                })}
              </div>
            )
          } else {
            return (
              <div
                className={clsx(
                  styles.miniAddressField,
                  styles[`miniAddressField${capitalize(item.key)}`]
                )}
                key={`${item.key}-${i}`}
              >
                {value[item.key]}
              </div>
            )
          }
        })}
        {/* {ADDRESS_FIELD_ORDER.map((field) => (
          <span
            key={field}
            className={clsx(
              styles.miniAddressField,
              styles[`miniAddressField${capitalize(field)}`]
            )}
          >
            {value[field]}
          </span>
        ))} */}
      </div>
    </div>
  )
}
