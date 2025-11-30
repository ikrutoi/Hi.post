import type { EnvelopeToolbarKey } from '@toolbar/domain/types'
import type {
  EnvelopeRole,
  AddressFields,
  EnvelopeRoleLabel,
  // RoleState,
} from '@shared/config/constants'
import type { Lang } from '@i18n/index'

export interface EnvelopeAddressProps {
  role: EnvelopeRole
  roleLabel: EnvelopeRoleLabel
  lang: Lang
  // value: RoleState
  // onValueChange: (
  //   role: EnvelopeRole,
  //   field: keyof AddressFields,
  //   value: string
  // ) => void
  // onInputNavigation: React.KeyboardEventHandler<HTMLInputElement>
  // setInputRef: (inputKey: string) => (element: HTMLInputElement | null) => void
  // // setBtnIconRef: (key: string) => (element: HTMLButtonElement | null) => void
  // setAddressFieldsetRef: (
  //   key: string
  // ) => (element: HTMLFieldSetElement | null) => void
  // setAddressLegendRef: (
  //   key: string
  // ) => (element: HTMLLegendElement | null) => void
  // onAddressAction: (
  //   action: EnvelopeToolbarKey,
  //   role: EnvelopeRole
  // ) => Promise<void>
  // onMouseEnter: (id: string) => void
  // onMouseLeave: (id: null) => void
  // stateMouseClip?: string | null
}
