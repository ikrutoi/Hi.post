import { useEnvelopeLocalState } from '../hooks/useEnvelopeLocalState'
import { useEnvelopeUiController } from '../controllers/useEnvelopeUiController'
import { useEnvelopeController } from '../controllers/useEnvelopeController'
import { useEnvelopeActionsController } from '../controllers/useEnvelopeActionsController'
import { useEnvelopeInteractionController } from '../controllers/useEnvelopeInteractionController'

export const useEnvelopeFacade = () => {
  const local = useEnvelopeLocalState()
  const ui = useEnvelopeUiController()
  const controller = useEnvelopeController({
    inputRefs: local.inputRefs,
    setValue: local.setValue,
  })
  const storeActions = useEnvelopeActionsController()
  const interaction = useEnvelopeInteractionController()

  return {
    state: {
      value: local.value,
      memoryAddress: local.memoryAddress,
      btnsAddress: local.btnsAddress,
      countAddress: local.countAddress,
      stateMouseClip: local.stateMouseClip,
      heightLogo: local.heightLogo,
      ...ui.state,
    },
    refs: {
      inputRefs: local.inputRefs,
      btnIconRefs: local.btnIconRefs,
      addressFieldsetRefs: local.addressFieldsetRefs,
      addressLegendRefs: local.addressLegendRefs,
      envelopeLogoRef: local.envelopeLogoRef,
    },
    actions: {
      local: {
        setValue: local.setValue,
        setMemoryAddress: local.setMemoryAddress,
        setBtnsAddress: local.setBtnsAddress,
        setCountAddress: local.setCountAddress,
        setStateMouseClip: local.setStateMouseClip,
        setHeightLogo: local.setHeightLogo,
      },
      ui: {
        update: ui.actions.update,
        updateSignal: ui.actions.updateSignal,
        reset: ui.actions.reset,
      },
      controller: {
        handleValue: controller.handleValue,
        handleMovingBetweenInputs: controller.handleMovingBetweenInputs,
      },
      store: {
        saveEnvelope: storeActions.saveEnvelope,
        resetEnvelope: storeActions.resetEnvelopeState,
        updateField: storeActions.updateField,
      },
      interaction: {
        handleAddressAction: interaction.handleAddressAction,
      },
    },
  }
}
