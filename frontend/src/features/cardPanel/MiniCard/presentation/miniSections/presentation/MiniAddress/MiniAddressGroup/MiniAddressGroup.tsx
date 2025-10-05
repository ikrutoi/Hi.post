import React from 'react'
import type {
  AddressRole,
  AddressLabelGroup,
  Address,
} from '@envelope/domain/types'
import styles from '../MiniAddress.module.scss'

interface MiniAddressGroupProps {
  group: AddressLabelGroup
  role: AddressRole
  values: Address
  groupIndex: number
}

export const MiniAddressGroup: React.FC<MiniAddressGroupProps> = ({
  group,
  role,
  values,
  groupIndex,
}) => (
  <div
    className={styles.miniAddress__group}
    key={`${role}-group-${groupIndex}`}
  >
    {group.map((sub, j) => (
      <span
        key={`${sub.field}-${groupIndex}-${j}`}
        className={`${styles.miniAddress__field} ${styles[`miniAddress__${sub.field}`]}`}
      >
        {values[sub.field]}
      </span>
    ))}
  </div>
)
