import { useEffect } from 'react'
import { useAppDispatch } from '@app/hooks'
import { addEnvelope } from '@store/slices/cardEditSlice'
import type { EnvelopeRole, AddressFields } from '@shared/config/constants'

export const useEnvelopeSyncController = (
  value: Record<EnvelopeRole, AddressFields>
) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(addEnvelope(value))
  }, [value])
}
