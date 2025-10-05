import React from 'react'
import { Label } from '../Label/Label'
import type {
  AddressRole,
  AddressLabelGroup,
  Address,
} from '@envelope/domain/types'

interface LabelGroupProps {
  group: AddressLabelGroup
  role: AddressRole
  values: Address
  handleValue: (role: AddressRole, field: keyof Address, value: string) => void
  handleMovingBetweenInputs: React.KeyboardEventHandler<HTMLInputElement>
  setInputRef: (id: string) => React.RefCallback<HTMLInputElement>
  groupIndex: number
}

export const LabelGroup: React.FC<LabelGroupProps> = ({
  group,
  role,
  values,
  handleValue,
  handleMovingBetweenInputs,
  setInputRef,
  groupIndex,
}) => (
  <div className={`address-form__group`} key={`${role}-group-${groupIndex}`}>
    {group.map((subLabel, j) => (
      <Label
        key={`${subLabel.field}-${groupIndex}-${j}`}
        role={role}
        label={subLabel.label}
        field={subLabel.field}
        values={values}
        handleValue={handleValue}
        handleMovingBetweenInputs={handleMovingBetweenInputs}
        setInputRef={setInputRef}
      />
    ))}
  </div>
)
