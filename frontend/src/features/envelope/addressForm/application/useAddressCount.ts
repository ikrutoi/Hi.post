import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import type { RootState } from '@app/state'
import {
  assetRecipientAddressAdapter,
  assetSenderAddressAdapter,
} from '@db/adapters'
import type { AddressRole } from '@envelope/domain'
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
        role === 'sender'
          ? assetSenderAddressAdapter
          : assetRecipientAddressAdapter
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
