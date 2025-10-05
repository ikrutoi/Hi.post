import type { AddressRole, Address } from '@envelope/domain/types'

export const useEnvelopeController = ({
  inputRefs,
  setValue,
}: {
  inputRefs: React.RefObject<Record<string, HTMLInputElement>>
  setValue: React.Dispatch<React.SetStateAction<Record<AddressRole, Address>>>
}) => {
  const handleValue = (
    role: AddressRole,
    field: keyof Address,
    value: string
  ) => {
    setValue((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value,
      },
    }))
  }

  const handleMovingBetweenInputs = (
    evt: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const indexInput = Number(evt.currentTarget.dataset.index)
    const role = evt.currentTarget.dataset.role as AddressRole
    if (evt.key === 'ArrowDown' || evt.key === 'Enter') {
      inputRefs.current[`${role}${indexInput + 1}`]?.focus()
    }
    if (evt.key === 'ArrowUp') {
      inputRefs.current[`${role}${indexInput - 1}`]?.focus()
    }
  }

  return {
    handleValue,
    handleMovingBetweenInputs,
  }
}
