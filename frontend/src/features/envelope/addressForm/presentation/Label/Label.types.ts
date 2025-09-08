import type { AddressRole, AddressField } from '../../../domain/addressModel'
import type { EnvelopeAddresses } from '../../../domain/addressModel'

export interface LabelProps {
  label: string
  field: AddressField
  role: AddressRole
  values: EnvelopeAddresses
  handleValue: (role: AddressRole, field: AddressField, value: string) => void
  handleMovingBetweenInputs: React.KeyboardEventHandler<HTMLInputElement>
  setInputRef: (inputKey: string) => (element: HTMLInputElement | null) => void
}
