import { RefObject, KeyboardEventHandler } from 'react'
import type {
  AddressRole,
  AddressField,
  AddressLabel,
  EnvelopeAddresses,
} from '@features/envelope/types'
import type { AddressLabelLayout } from '@i18n/index'
import type { Lang } from '@i18n/index'

export interface LabelProps {
  label: string
  field: AddressField
  role: AddressRole
  values: EnvelopeAddresses
  handleValue: (role: AddressRole, field: AddressField, value: string) => void
  handleMovingBetweenInputs: KeyboardEventHandler<HTMLInputElement>
  setInputRef: (inputKey: string) => (element: HTMLInputElement | null) => void
}

interface ListLabelsAddress {
  name: AddressRole
  list: AddressLabelLayout
}

export interface AddressProps {
  values: Record<string, string>
  listLabelsAddress: {
    name: AddressRole
    listLabelsAddress: ListLabelsAddress
  }
  handleValue: (role: AddressRole, field: AddressField, value: string) => void
  handleMovingBetweenInputs: React.KeyboardEventHandler<HTMLInputElement>
  setInputRef: (inputKey: string) => RefObject<HTMLInputElement>
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
}

export interface EnvelopeAddressProps {
  role: AddressRole
  lang: Lang
  values: EnvelopeAddresses
  handleValue: (role: AddressRole, field: AddressField, value: string) => void
  handleMovingBetweenInputs: React.KeyboardEventHandler<HTMLInputElement>
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
}
