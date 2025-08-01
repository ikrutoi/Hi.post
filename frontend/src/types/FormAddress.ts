import { RefObject } from 'react'

export interface LabelProps {
  name: string
  field: string
  values: Record<string, string>
  handleValue: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void
  handleMovingBetweenInputs: (
    e: React.KeyboardEvent<HTMLInputElement>,
    name: string
  ) => void
  setInputRef: (key: string) => RefObject<HTMLInputElement>
}

export interface ListLabelsAddress {
  name: 'myaddress' | 'toaddress'
  list: Array<string | string[]>
}

export interface FormAddressProps {
  values: Record<string, string>
  listLabelsAddress: ListLabelsAddress
  handleValue: LabelProps['handleValue']
  handleMovingBetweenInputs: LabelProps['handleMovingBetweenInputs']
  setInputRef: LabelProps['setInputRef']
  setBtnIconRef: (key: string) => RefObject<HTMLButtonElement>
  // setAddressFormRef: (
  //   key: string
  // ) => RefObject<HTMLLegendElement | HTMLFieldSetElement>
  setAddressFieldsetRef: (key: string) => RefObject<HTMLFieldSetElement>
  setAddressLegendRef: (key: string) => RefObject<HTMLLegendElement>
  handleClickBtn: (
    e: React.MouseEvent<HTMLButtonElement>,
    field: string
  ) => void
  handleMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => void
  handleMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => void
}
