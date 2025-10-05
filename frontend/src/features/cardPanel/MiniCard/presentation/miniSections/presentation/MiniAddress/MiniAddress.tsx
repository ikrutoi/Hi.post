import React from 'react'
import type {
  Address,
  AddressRole,
  AddressLabelLayout,
  AddressLabelGroup,
  AddressLabel,
} from '@envelope/domain/types'
import styles from './MiniAddress.module.scss'
import { MiniAddressGroup } from './MiniAddressGroup/MiniAddressGroup'

interface MiniAddressProps {
  role: AddressRole
  values: Address
  labelLayout: AddressLabelLayout
}

export const MiniAddress: React.FC<MiniAddressProps> = ({
  role,
  values,
  labelLayout,
}) => {
  return (
    <div className={`${styles.miniAddress} ${styles[`miniAddress--${role}`]}`}>
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
            className={`${styles.miniAddress__field} ${styles[`miniAddress__${item.field}`]}`}
          >
            {values[item.field]}
          </span>
        )
      )}
    </div>
  )
}
