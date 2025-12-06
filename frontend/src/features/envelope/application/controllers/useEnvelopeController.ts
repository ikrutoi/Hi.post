import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  setEnvelopeComplete,
  recomputeEnvelope,
  clearRole,
  clearEnvelope,
} from '../../infrastructure/state'
import {
  selectEnvelopeState,
  selectIsEnvelopeComplete,
  selectIsSenderComplete,
  selectIsRecipientComplete,
} from '../../infrastructure/selectors'
import type { EnvelopeRole } from '@shared/config/constants'

export const useEnvelopeController = () => {
  const dispatch = useAppDispatch()

  const envelope = useAppSelector(selectEnvelopeState)
  const isEnvelopeComplete = useAppSelector(selectIsEnvelopeComplete)
  const isSenderComplete = useAppSelector(selectIsSenderComplete)
  const isRecipientComplete = useAppSelector(selectIsRecipientComplete)

  const actions = {
    setEnvelopeComplete: (value: boolean) =>
      dispatch(setEnvelopeComplete(value)),

    recomputeEnvelope: (sender: boolean, recipient: boolean) =>
      dispatch(recomputeEnvelope({ sender, recipient })),

    clearRole: (role: EnvelopeRole) => dispatch(clearRole(role)),

    clearEnvelope: () => dispatch(clearEnvelope()),
  }

  return {
    envelope,
    isEnvelopeComplete,
    isSenderComplete,
    isRecipientComplete,
    actions,
  }
}
