import { useEffect } from 'react'
import { useEnvelopeUiController } from '@envelope/application/controllers'
import type {
  AddressRole,
  AddressFields,
} from '@entities/envelope/domain/types'

export const useMiniAddressEffect = ({
  value,
  setBtnsAddress,
}: {
  value: Record<AddressRole, AddressFields>
  setBtnsAddress: React.Dispatch<
    React.SetStateAction<Record<AddressRole, AddressFields>>
  >
}) => {
  const { state, actions } = useEnvelopeUiController()
  const { miniAddressClose } = state
  const setUiState = actions.update

  useEffect(() => {
    if (!miniAddressClose) return

    ;(['sender', 'recipient'] as AddressRole[]).forEach((role) => {
      const fieldValue = value[role][miniAddressClose]
      if (fieldValue !== '') {
        setBtnsAddress((prev) => ({
          ...prev,
          [role]: {
            ...prev[role],
            save: true,
          },
        }))
      }
    })

    setUiState({ miniAddressClose: null })
  }, [miniAddressClose])
}
