import type { EnvelopeToolbarKey } from '@toolbar/domain/types'
import type {
  EnvelopeRole,
  AddressFields,
  EnvelopeState,
} from '@shared/config/constants'
import type { Lang } from '@i18n/index'

export interface EnvelopeAddressProps {
  role: EnvelopeRole
  lang: Lang
  value: EnvelopeState
  handleValue: (
    role: EnvelopeRole,
    field: keyof AddressFields,
    value: string
  ) => void
  handleMovingBetweenInputs: React.KeyboardEventHandler<HTMLInputElement>
  setInputRef: (inputKey: string) => (element: HTMLInputElement | null) => void
  setBtnIconRef: (key: string) => (element: HTMLButtonElement | null) => void
  setAddressFieldsetRef: (
    key: string
  ) => (element: HTMLFieldSetElement | null) => void
  setAddressLegendRef: (
    key: string
  ) => (element: HTMLLegendElement | null) => void
  handleAddressAction: (
    action: EnvelopeToolbarKey,
    role: EnvelopeRole
  ) => Promise<void>
  handleMouseEnter: (id: string) => void
  handleMouseLeave: (id: null) => void
  stateMouseClip?: string | null
}
