import { useEffect, useState } from 'react'
import { recipientAdapter, senderAdapter } from '@db/adapters/card'
import { useEnvelopeFacade } from '../../../application/facades'
import type { EnvelopeRole } from '@shared/config/constants'

export const useAddressCount = (role: EnvelopeRole) => {
  const [count, setCount] = useState<number | null>(null)
  const { state, actions } = useEnvelopeFacade()
  const { envelopeSaveSecond, envelopeRemoveAddress } = state
  const { updateSignal } = actions.ui

  useEffect(() => {
    const update = async () => {
      const adapter = role === 'sender' ? senderAdapter : recipientAdapter
      const count = await adapter.count()
      setCount(count)
    }
    update()
  }, [role])

  useEffect(() => {
    if (envelopeSaveSecond) {
      updateSignal('envelopeSaveSecond', false)
    }
    if (envelopeRemoveAddress) {
      updateSignal('envelopeRemoveAddress', false)
    }
  }, [envelopeSaveSecond, envelopeRemoveAddress])

  return count
}
