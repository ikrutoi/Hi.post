import React from 'react'
import clsx from 'clsx'
import type { Address, AddressLabelLayout } from '@envelope/domain/types'
import { EnvelopeRole } from '@shared/config/constants'
import styles from './MiniAddress.module.scss'
import { MiniAddressGroup } from './MiniAddressGroup/MiniAddressGroup'

interface MiniAddressProps {
  role: EnvelopeRole
  values: Address
  labelLayout: AddressLabelLayout
}

export const MiniAddress: React.FC<MiniAddressProps> = ({
  role,
  values,
  labelLayout,
}) => {
  return (
    <div
      className={clsx(
        styles.miniAddress,
        styles[`miniAddress${role[0].toUpperCase() + role.slice(1)}`]
      )}
    >
      {labelLayout.map((item, i) =>
        Array.isArray(item) ? (
          <MiniAddressGroup
            key={`${role}-group-${i}`}
            group={item}
            role={role}
            values={values}
            groupIndex={i}
          />
        ) : (
          <span
            key={`${item.field}-${i}`}
            className={clsx(
              styles.miniAddressField,
              styles[
                `miniAddress${item.field[0].toUpperCase() + item.field.slice(1)}`
              ]
            )}
          >
            {values[item.field]}
          </span>
        )
      )}
    </div>
  )
}
