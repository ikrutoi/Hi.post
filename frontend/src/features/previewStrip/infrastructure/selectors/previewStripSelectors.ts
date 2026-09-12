import type { RootState } from '@app/state'
import { EMPTY_STRINGS } from '@shared/utils/helpers'
import type { AddressTemplateRef } from '../state/previewStripOrderSlice'

const EMPTY_ADDRESS_TEMPLATE_REFS: AddressTemplateRef[] = []

const selectPreviewStripOrder = (state: RootState) => state.previewStripOrder

export const selectCardtextTemplateIds = (state: RootState) =>
  selectPreviewStripOrder(state)?.cardtextTemplateIds ?? EMPTY_STRINGS

export const selectAddressTemplateRefs = (state: RootState) =>
  selectPreviewStripOrder(state)?.addressTemplateRefs ??
  EMPTY_ADDRESS_TEMPLATE_REFS

export const selectAddressTemplatesReloadVersion = (state: RootState) =>
  selectPreviewStripOrder(state)?.addressTemplatesReloadVersion ?? 0

export const selectAddressBookReloadVersion = (state: RootState) =>
  selectPreviewStripOrder(state)?.addressBookReloadVersion ?? 0
