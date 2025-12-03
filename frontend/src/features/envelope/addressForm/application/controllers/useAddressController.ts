import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  updateField,
  clearRole,
  setComplete,
  toggleSenderEnabled,
} from '../../infrastructure/state'
import {
  selectAddressByRole,
  selectIsAddressComplete,
  selectCompletedFields,
  selectIsSenderEnabled,
} from '../../infrastructure/selectors'
import type { EnvelopeRole, AddressFields } from '@shared/config/constants'

export function useAddressController(role: EnvelopeRole) {
  const dispatch = useAppDispatch()

  const address = useAppSelector((state) => selectAddressByRole(state, role))
  const completedFields = useAppSelector((state) =>
    selectCompletedFields(state, role)
  )
  const isComplete = useAppSelector((state) =>
    selectIsAddressComplete(state, role)
  )

  const enabled =
    role === 'sender'
      ? useAppSelector((state) => selectIsSenderEnabled(state))
      : true

  const onValueChange = (field: keyof AddressFields, value: string) => {
    dispatch(updateField({ role, field, value }))
  }

  const clearSection = () => {
    dispatch(clearRole(role))
  }

  const markComplete = (flag: boolean) => {
    dispatch(setComplete({ role, isComplete: flag }))
  }

  const toggleEnabled = (flag: boolean) => {
    if (role === 'sender') {
      dispatch(toggleSenderEnabled(flag))
    }
  }

  return {
    state: {
      address,
      completedFields,
      isComplete,
      enabled,
    },
    actions: {
      onValueChange,
      clearSection,
      markComplete,
      toggleEnabled,
    },
  }
}
