import type {
  AddressRole,
  AddressField,
  EnvelopeAddresses,
} from '@envelope/domain'
import type { Lang } from '@i18n/index'

export interface EnvelopeAddressProps {
  role: AddressRole
  lang: Lang
  values: EnvelopeAddresses
  handleValue: (role: AddressRole, field: AddressField, value: string) => void
  handleMovingBetweenInputs: React.KeyboardEventHandler<HTMLInputElement>
  handleClickClip: (role: AddressRole) => void
  setInputRef: (inputKey: string) => (element: HTMLInputElement | null) => void
  setBtnIconRef: (key: string) => (element: HTMLButtonElement | null) => void
  setAddressFieldsetRef: (
    key: string
  ) => (element: HTMLFieldSetElement | null) => void
  setAddressLegendRef: (
    key: string
  ) => (element: HTMLLegendElement | null) => void
  handleClickBtn: (
    e: React.MouseEvent<HTMLButtonElement>,
    role: AddressRole
  ) => Promise<void>
  handleMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => void
  handleMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => void
  stateMouseClip?: string | null
}
