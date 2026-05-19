import { RootState } from '@app/state'
import type { CardtextContent } from '../../domain/editor/editor.types'
import type { PanelDensity2Size } from '@shared/ui/icons'

export const selectCardtextAddTemplateOpen = (state: RootState): boolean =>
  state.cardtext.isAddTemplateOpen ?? false

export const selectCardtextEditTitleOpen = (state: RootState): boolean =>
  state.cardtext.isEditTitleOpen ?? false

export const selectCardtextListSortDirection = (
  state: RootState,
): 'asc' | 'desc' => state.cardtext.cardtextListSortDirection ?? 'asc'

export const selectCardtextListPanelDensity = (
  state: RootState,
): PanelDensity2Size => state.cardtext.cardtextListPanelDensity ?? 1

export const selectCardtextTemplatesListItems = (
  state: RootState,
): CardtextContent[] | null => state.cardtext.templatesList ?? null

export const selectCardtextTemplatesListLoading = (state: RootState): boolean =>
  state.cardtext.templatesListLoading === true
