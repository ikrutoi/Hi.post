import type { RootState } from '@app/state'

const selectPreviewStripOrder = (state: RootState) => state.previewStripOrder

export const selectCardtextTemplateIds = (state: RootState) =>
  selectPreviewStripOrder(state)?.cardtextTemplateIds ?? []

export const selectAddressTemplateRefs = (state: RootState) =>
  selectPreviewStripOrder(state)?.addressTemplateRefs ?? []

export const selectAddressTemplatesReloadVersion = (state: RootState) =>
  selectPreviewStripOrder(state)?.addressTemplatesReloadVersion ?? 0

export const selectAddressBookReloadVersion = (state: RootState) =>
  selectPreviewStripOrder(state)?.addressBookReloadVersion ?? 0
