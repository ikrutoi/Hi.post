import React from 'react'
import clsx from 'clsx'
import { Label } from '../Label/Label'
import styles from './LabelGroup.module.scss'
import type {
  EnvelopeRole,
  AddressFields,
  AddressFieldLabel,
  EnvelopeRoleLabel,
} from '@shared/config/constants'
import type { AddressFieldItem } from '../../domain/types'

interface LabelGroupProps {
  group: AddressFieldItem[]
  roleLabel: EnvelopeRoleLabel
  role: EnvelopeRole
  value: AddressFields
  onValueChange: (field: keyof AddressFields, value: string) => void
  // onInputNavigation: React.KeyboardEventHandler<HTMLInputElement>
  // setInputRef: (id: string) => React.RefCallback<HTMLInputElement>
  // groupIndex: number
}

export const LabelGroup: React.FC<LabelGroupProps> = ({
  group,
  roleLabel,
  role,
  value,
  onValueChange,
  // onInputNavigation,
  // setInputRef,
}) => {
  return (
    <div className={clsx(styles.labelGroup, styles[`labelGroup${roleLabel}`])}>
      {group.map((item, j) => (
        <Label
          key={`${item.key}-${j}`}
          role={role}
          roleLabel={roleLabel}
          label={item.label}
          value={value[item.key]}
          field={item.key}
          index={j}
          onValueChange={onValueChange}
          // onInputNavigation={onInputNavigation}
          // setInputRef={setInputRef}
        />
      ))}
    </div>
  )
}
