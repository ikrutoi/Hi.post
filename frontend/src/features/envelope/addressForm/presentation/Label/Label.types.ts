import type {
  AddressRole,
  AddressField,
} from '../../../domain/types/address.types'
import type { EnvelopeAddresses } from '../../../domain/types/address.types'

export interface LabelProps {
  label: string
  field: AddressField
  role: AddressRole
  values: EnvelopeAddresses
  handleValue: (role: AddressRole, field: AddressField, value: string) => void
  handleMovingBetweenInputs: React.KeyboardEventHandler<HTMLInputElement>
  setInputRef: (inputKey: string) => (element: HTMLInputElement | null) => void
}
