import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@app/hooks'
import { createStoreAdapter } from '@db/adapters/factory'
import { EnvelopeRole, AddressFields } from '@shared/config/constants'
import { useLayoutSelectedTemplateSection } from '@shared/hooks'
import { useEnvelopeLocalState } from '../hooks'
import { useEnvelopeUiController } from './useEnvelopeUiController'
import type { StoreMap } from '@/db/types'
import type { EnvelopeToolbarKey } from '@toolbar/domain/types'

// type EnvelopeToolbarKey = 'clip' | 'save' | 'delete'

export const useEnvelopeInteractionController = () => {
  const { value, setValue, btnsAddress, setBtnsAddress } =
    useEnvelopeLocalState()
  const { actions } = useEnvelopeUiController()
  const dispatch = useAppDispatch()
  const { handleSelectedTemplateSection } = useLayoutSelectedTemplateSection()

  const senderAdapter = createStoreAdapter<StoreMap['sender']>('sender')
  const recipientAdapter =
    createStoreAdapter<StoreMap['recipient']>('recipient')

  const handleAddressAction = async (
    action: EnvelopeToolbarKey,
    role: EnvelopeRole
  ) => {
    if (action === 'savedTemplates' && btnsAddress[role].clip) {
      handleSelectedTemplateSection(role)
      return
    }

    if (action === 'save' && btnsAddress[role].save) {
      const personalId = uuidv4().split('-')[0]
      const cleaned = {
        name: value[role].name.trim().replace(/\s+/g, ' '),
        country: value[role].country.trim().replace(/\s+/g, ' '),
        city: value[role].city.trim().replace(/\s+/g, ' '),
      }

      setValue((prev) => ({
        ...prev,
        [role]: { ...prev[role], ...cleaned },
      }))

      const record = {
        address: cleaned,
        personalId,
      }

      const adapter = role === 'sender' ? senderAdapter : recipientAdapter

      await adapter.addAutoIdRecord(record)

      setBtnsAddress((prev) => ({
        ...prev,
        [role]: { ...prev[role], save: false },
      }))

      // dispatch(updateButtonsState({ envelopeSave: role }))
      // dispatch(setChoiceClip(role))
      // dispatch(setFullCardPersonalId(personalId))
      return
    }

    const resetLocalAddress = (role: EnvelopeRole) => {
      setValue((prev) => ({
        ...prev,
        [role]: Object.keys(prev[role]).reduce((acc, key) => {
          acc[key as keyof AddressFields] = ''
          return acc
        }, {} as AddressFields),
      }))
    }

    if (action === 'delete') {
      resetLocalAddress(role)
    }
  }

  return { handleAddressAction }
}
