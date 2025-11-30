import { useEnvelopeLocalState } from '../hooks/useEnvelopeLocalState'
// import { useEnvelopeUiController } from '../controllers/useEnvelopeUiController'
import { useEnvelopeLayoutController } from '../controllers'
// import { useEnvelopeActionsController } from '../controllers/useEnvelopeActionsController'
import { useEnvelopeInteractionController } from '../controllers/useEnvelopeInteractionController'

export const useEnvelopeLayoutFacade = () => {
  const local = useEnvelopeLocalState()
  // const ui = useEnvelopeUiController()
  const controller = useEnvelopeLayoutController({
    inputRefs: local.inputRefs,
    setValue: local.setValue,
  })
  // const storeActions = useEnvelopeActionsController()
  const interaction = useEnvelopeInteractionController()

  return {
    state: {
      value: local.value,
      memoryAddress: local.memoryAddress,
      countAddress: local.countAddress,
      stateMouseClip: local.stateMouseClip,
      // heightLogo: local.heightLogo,
      // ...ui.state,
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
        setCountAddress: local.setCountAddress,
        setStateMouseClip: local.setStateMouseClip,
      },
      ui: {
        // update: ui.actions.update,
        // updateSignal: ui.actions.updateSignal,
        // reset: ui.actions.reset,
      },
      controller: {
        handleValue: controller.handleValue,
        handleMovingBetweenInputs: controller.handleMovingBetweenInputs,
      },
      store: {
        // saveEnvelope: storeActions.saveEnvelope,
        // resetEnvelope: storeActions.resetEnvelopeState,
        // updateField: storeActions.updateField,
      },
      interaction: {
        handleAddressAction: interaction.handleAddressAction,
      },
    },
  }
}
