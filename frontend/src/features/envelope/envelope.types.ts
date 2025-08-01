import { RefObject } from 'react'

export interface EnvelopeState {
  items: EnvelopeItem[]
  loading: boolean
  error: string | null
}

export interface EnvelopeItem {
  id: string
  address: string
  sender: string
  receivedAt: string
}

export interface FetchEnvelopesResponse {
  items: EnvelopeItem[]
}

export interface CreateEnvelopePayload {
  address: string
  sender: string
}

export interface EnvelopeFieldData {
  [shortName: string]: string
}

export interface EnvelopeValues {
  myaddress: EnvelopeFieldData
  toaddress: EnvelopeFieldData
  [key: string]: EnvelopeFieldData
}

export interface LabelProps {
  name: string
  field: keyof EnvelopeValues
  values: Record<string, string>
  handleValue: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void
  handleMovingBetweenInputs: (
    e: React.KeyboardEvent<HTMLInputElement>,
    name: string
  ) => void
  setInputRef: (key: string) => RefObject<HTMLInputElement>
}

export interface ListLabelsAddress {
  name: keyof EnvelopeValues
  list: Array<string | string[]>
}

export interface AddressProps {
  values: Record<string, string>
  listLabelsAddress: ListLabelsAddress
  handleValue: LabelProps['handleValue']
  handleMovingBetweenInputs: LabelProps['handleMovingBetweenInputs']
  setInputRef: LabelProps['setInputRef']
  setBtnIconRef: (key: string) => RefObject<HTMLButtonElement>
  setAddressFieldsetRef: (key: string) => RefObject<HTMLFieldSetElement>
  setAddressLegendRef: (key: string) => RefObject<HTMLLegendElement>
  handleClickBtn: (
    e: React.MouseEvent<HTMLButtonElement>,
    field: string
  ) => void
  handleMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => void
  handleMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export type EnvelopeStatus = 'new' | 'processing' | 'sent'
