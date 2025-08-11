import { useMemo } from 'react'
import { useAppSelector } from '@shared/hooks/useAppSelectors'
import {
  AddressRole,
  EnvelopeAddresses,
  Address,
} from '@features/envelope/types/envelopeTypes'
import {
  selectEnvelopeAddresses,
  selectEnvelopeLoading,
  selectSenderAddress,
  selectRecipientAddress,
} from '@features/envelope/store/envelopeSelectors'
import { validateEnvelopeAddresses } from '@features/envelope/lib/validateEnvelopeAddress'

export const useEnvelopeLogic = () => {
  const addresses = useAppSelector(selectEnvelopeAddresses)
  const loading = useAppSelector(selectEnvelopeLoading)
  const sender = useAppSelector(selectSenderAddress)
  const recipient = useAppSelector(selectRecipientAddress)

  const validationResult = useMemo(() => {
    return validateEnvelopeAddresses(addresses)
  }, [addresses])

  const getAddressByRole = (role: AddressRole): Address => {
    return addresses[role]
  }

  const isValid = Object.values(validationResult).every(Boolean)

  return {
    addresses,
    sender,
    recipient,
    loading,
    getAddressByRole,
    validationResult,
    isValid,
  }
}
