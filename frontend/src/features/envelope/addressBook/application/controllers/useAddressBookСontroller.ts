import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useAppDispatch } from '@app/hooks/useAppDispatch'

import { addUniqueRecordAddress } from '@utils/cardFormNav/indexDB/indexDb'
import { useLayoutMetaFacade } from '@layout/application/facades'
// import {
//   setChoiceClip,
//   setSavedCardId,
//   updateButtonsState,
// } from '@layout/application/facades'
// } from '@store/slices/infoButtonsSlice'
import type { Address, AddressRole } from '@envelope/domain/types'

type ControllerParams = {
  value: Record<AddressRole, Address>
  setValue: React.Dispatch<React.SetStateAction<Record<AddressRole, Address>>>
  memoryAddress: Record<
    AddressRole,
    { address: Record<string, string> }[] | null
  >
  setMemoryAddress: React.Dispatch<any>
  btnsAddress: Record<AddressRole, any>
  setBtnsAddress: React.Dispatch<any>
  countAddress: Record<AddressRole, number | null>
  setCountAddress: React.Dispatch<any>
}

export const useAddressBookController = ({
  value,
  setValue,
  memoryAddress,
  setMemoryAddress,
  btnsAddress,
  setBtnsAddress,
  countAddress,
  setCountAddress,
}: ControllerParams) => {
  const dispatch = useAppDispatch()

  const { setChoiceClip } = useLayoutMetaFacade()

  const clearSectionAddress = useCallback(
    (section: AddressRole) => {
      setValue((prev) => ({
        ...prev,
        [section]: Object.keys(prev[section]).reduce(
          (acc, key) => {
            acc[key] = ''
            return acc
          },
          {} as Record<string, string>
        ),
      }))
    },
    [setValue]
  )

  const changeParityInputsAddress = useCallback(
    (section: AddressRole): boolean => {
      const memory = memoryAddress[section]
      const current = value[section]
      if (!memory) return true
      return !memory.some((entry) =>
        Object.entries(entry.address).every(
          ([key, val]) => val === current[key as keyof Address]
        )
      )
    },
    [memoryAddress, value]
  )

  const handleClickClip = useCallback(
    (section: AddressRole) => {
      if (btnsAddress[section].clip === true) {
        dispatch(setChoiceClip(section))
      } else {
        dispatch(setChoiceClip(null))
      }
    },
    [btnsAddress, dispatch]
  )

  const handleClickBtn = useCallback(
    async (evt: React.MouseEvent<HTMLButtonElement>, section: AddressRole) => {
      evt.preventDefault()
      const tooltip = (evt.currentTarget.dataset.tooltip ?? '') as string

      if (tooltip === 'clip') {
        handleClickClip(section)
      }

      if (tooltip === 'save' && btnsAddress[section].save) {
        const personalId = uuidv4().split('-')[0]

        const cleanup = (text: string) =>
          text.split(' ').filter(Boolean).join(' ')

        setValue((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            name: cleanup(prev[section].name),
            country: cleanup(prev[section].country),
            city: cleanup(prev[section].city),
          },
        }))

        await addUniqueRecordAddress(section, value[section], personalId)

        setBtnsAddress((prev) => ({
          ...prev,
          [section]: { ...prev[section], save: false },
        }))

        dispatch(updateButtonsState({ envelopeSave: section }))
        dispatch(setChoiceClip(section))
        dispatch(setSavedCardId(personalId))
      }

      if (tooltip === 'delete') {
        clearSectionAddress(section)
      }
    },
    [
      btnsAddress,
      value,
      setValue,
      dispatch,
      clearSectionAddress,
      handleClickClip,
    ]
  )

  return {
    handleClickBtn,
    handleClickClip,
    clearSectionAddress,
    changeParityInputsAddress,
  }
}
