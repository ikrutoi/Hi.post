import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateField, clearRole, setComplete } from '../../infrastructure/state'
import {
  selectAddressByRole,
  selectIsAddressComplete,
  selectCompletedFields,
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

  const onValueChange = (field: keyof AddressFields, value: string) => {
    dispatch(updateField({ role, field, value }))
  }

  const clearSection = () => {
    dispatch(clearRole(role))
  }

  const markComplete = (flag: boolean) => {
    dispatch(setComplete({ role, isComplete: flag }))
  }

  return {
    state: {
      address,
      completedFields,
      isComplete,
    },
    actions: {
      onValueChange,
      clearSection,
      markComplete,
    },
  }
}
