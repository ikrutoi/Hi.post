import type { EnvelopeRole, AddressFields } from '@shared/config/constants'

export const useEnvelopeLayoutController = ({
  inputRefs,
  setValue,
}: {
  inputRefs: React.RefObject<Record<string, HTMLInputElement>>
  setValue: React.Dispatch<
    React.SetStateAction<Record<EnvelopeRole, AddressFields>>
  >
}) => {
  const handleValue = (
    role: EnvelopeRole,
    field: keyof AddressFields,
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
    const role = evt.currentTarget.dataset.role as EnvelopeRole
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
