import { useEffect } from 'react'
import { useAppDispatch } from '@app/hooks'
import { addEnvelope } from '@store/slices/cardEditSlice'
import type { AddressRole, Address } from '@envelope/domain'

export const useEnvelopeSyncController = (
  value: Record<AddressRole, Address>
) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(addEnvelope(value))
  }, [value])
}
