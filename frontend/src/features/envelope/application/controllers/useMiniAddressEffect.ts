import { useEffect } from 'react'
import type { AddressRole, ToggleSet } from '@envelope/domain'
import { useEnvelopeUiState } from '@envelope/application/controllers'

export const useMiniAddressEffect = ({
  value,
  setBtnsAddress,
}: {
  value: Record<AddressRole, Record<string, string>>
  setBtnsAddress: React.Dispatch<
    React.SetStateAction<Record<AddressRole, ToggleSet>>
  >
}) => {
  const { miniAddressClose, setUiState } = useEnvelopeUiState()

  useEffect(() => {
    if (!miniAddressClose) return

    const isComplete = Object.values(value[miniAddressClose]).every(
      (val) => val !== ''
    )

    if (isComplete) {
      setBtnsAddress((prev) => ({
        ...prev,
        [miniAddressClose]: {
          ...prev[miniAddressClose],
          save: true,
        },
      }))
    }

    setUiState({ miniAddressClose: null })
  }, [miniAddressClose])
}
