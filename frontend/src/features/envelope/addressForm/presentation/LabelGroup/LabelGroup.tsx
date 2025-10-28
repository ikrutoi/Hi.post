import React from 'react'
import { Label } from '../Label/Label'
import type { EnvelopeRole, AddressFields } from '@shared/config/constants'
import type { AddressLabelGroup } from '../../../domain/types'

interface LabelGroupProps {
  group: AddressLabelGroup
  role: EnvelopeRole
  valueRole: AddressFields
  handleValue: (
    role: EnvelopeRole,
    field: keyof AddressFields,
    valueRole: string
  ) => void
  handleMovingBetweenInputs: React.KeyboardEventHandler<HTMLInputElement>
  setInputRef: (id: string) => React.RefCallback<HTMLInputElement>
  groupIndex: number
}

export const LabelGroup: React.FC<LabelGroupProps> = ({
  group,
  role,
  valueRole,
  handleValue,
  handleMovingBetweenInputs,
  setInputRef,
  groupIndex,
}) => (
  <div className={`address-form__group`} key={`${role}-group-${groupIndex}`}>
    {group.map((item, j) => (
      <Label
        key={`${item.field}-${groupIndex}-${j}`}
        role={role}
        label={item.label}
        field={item.field}
        valueRole={item.field}
        index={j}
        handleValue={handleValue}
        handleMovingBetweenInputs={handleMovingBetweenInputs}
        setInputRef={setInputRef}
      />
    ))}
  </div>
)
