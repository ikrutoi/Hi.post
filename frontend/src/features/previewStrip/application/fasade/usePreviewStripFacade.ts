import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCardtextTemplateIds,
  selectAddressTemplateRefs,
  selectAddressTemplatesReloadVersion,
} from '../../infrastructure/selectors'
import {
  addCardtextTemplateId,
  removeCardtextTemplateId,
  addAddressTemplateRef,
  removeAddressTemplateRef,
  restorePreviewStripOrder,
  incrementAddressTemplatesReloadVersion,
} from '../../infrastructure/state/previewStripOrderSlice'
import type {
  AddressTemplateRef,
  PreviewStripOrderState,
} from '../../infrastructure/state/previewStripOrderSlice'

export const usePreviewStripFacade = () => {
  const dispatch = useAppDispatch()
  const cardtextTemplateIds = useAppSelector(selectCardtextTemplateIds)
  const addressTemplateRefs = useAppSelector(selectAddressTemplateRefs)
  const addressTemplatesReloadVersion = useAppSelector(
    selectAddressTemplatesReloadVersion,
  )

  const addCardtextId = (id: string) => {
    dispatch(addCardtextTemplateId(id))
  }

  const removeCardtextId = (id: string) => {
    dispatch(removeCardtextTemplateId(id))
  }

  const addAddressRef = (ref: AddressTemplateRef) => {
    dispatch(addAddressTemplateRef(ref))
  }

  const removeAddressRef = (ref: AddressTemplateRef) => {
    dispatch(removeAddressTemplateRef(ref))
  }

  const restoreOrder = (payload: Partial<PreviewStripOrderState>) => {
    dispatch(restorePreviewStripOrder(payload))
  }

  const reloadAddressTemplates = () => {
    dispatch(incrementAddressTemplatesReloadVersion())
  }

  return {
    cardtextTemplateIds,
    addressTemplateRefs,
    addressTemplatesReloadVersion,

    addCardtextId,
    removeCardtextId,
    addAddressRef,
    removeAddressRef,
    restoreOrder,
    reloadAddressTemplates,
  }
}
