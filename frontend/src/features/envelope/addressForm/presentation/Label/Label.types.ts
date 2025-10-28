import type {
  EnvelopeRole,
  AddressField,
  EnvelopeState,
} from '@shared/config/constants'

export interface LabelProps {
  label: string
  field: AddressField
  role: EnvelopeRole
  value: EnvelopeState
  handleValue: (role: EnvelopeRole, field: AddressField, value: string) => void
  handleMovingBetweenInputs: React.KeyboardEventHandler<HTMLInputElement>
  setInputRef: (inputKey: string) => (element: HTMLInputElement | null) => void
}
