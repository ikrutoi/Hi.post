import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import type { RootState } from '@app/state'
import {
  recipientAddressAdapter,
  senderAddressAdapter,
} from '@db/adapters/card'
import type { AddressRole } from '@envelope/domain/types'
import { updateButtonsState } from '@store/slices/infoButtonsSlice'

export const useAddressCount = (role: AddressRole) => {
  const [count, setCount] = useState<number | null>(null)
  const dispatch = useAppDispatch()

  const infoEnvelopeSaveSecond = useAppSelector(
    (state: RootState) => state.infoButtons.envelopeSaveSecond
  )
  const infoEnvelopeRemove = useAppSelector(
    (state: RootState) => state.infoButtons.envelopeRemoveAddress
  )

  useEffect(() => {
    const update = async () => {
      const adapter =
        role === 'sender' ? senderAddressAdapter : recipientAddressAdapter
      const count = await adapter.count()
      setCount(count)
    }
    update()
  }, [role])

  useEffect(() => {
    if (infoEnvelopeSaveSecond) {
      dispatch(updateButtonsState({ envelopeSaveSecond: false }))
    }
    if (infoEnvelopeRemove) {
      dispatch(updateButtonsState({ envelopeRemoveAddress: false }))
    }
  }, [infoEnvelopeSaveSecond, infoEnvelopeRemove, dispatch])

  return count
}
