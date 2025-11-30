import { useEffect } from 'react'
// import { useEnvelopeUiController } from '@envelope/application/controllers'
import type { EnvelopeRole, AddressFields } from '@shared/config/constants'

export const useMiniAddressEffect = ({
  value,
  setBtnsAddress,
}: {
  value: Record<EnvelopeRole, AddressFields>
  setBtnsAddress: React.Dispatch<
    React.SetStateAction<Record<EnvelopeRole, AddressFields>>
  >
}) => {
  // const { state, actions } = useEnvelopeUiController()
  // const { miniAddressClose } = state
  // const setUiState = actions.update
  // useEffect(() => {
  //   if (!miniAddressClose) return
  //   ;(['sender', 'recipient'] as EnvelopeRole[]).forEach((role) => {
  //     const fieldValue = value[role][miniAddressClose]
  //     if (fieldValue !== '') {
  //       setBtnsAddress((prev) => ({
  //         ...prev,
  //         [role]: {
  //           ...prev[role],
  //           save: true,
  //         },
  //       }))
  //     }
  //   })
  //   setUiState({ miniAddressClose: null })
  // }, [miniAddressClose])
}
