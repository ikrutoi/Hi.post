import { useEffect } from 'react'
import { useAppDispatch } from '@app/hooks'
import { addEnvelope } from '@store/slices/cardEditSlice'
import type {
  AddressRole,
  AddressFields,
} from '@entities/envelope/domain/types'

export const useEnvelopeSyncController = (
  value: Record<AddressRole, AddressFields>
) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(addEnvelope(value))
  }, [value])
}
