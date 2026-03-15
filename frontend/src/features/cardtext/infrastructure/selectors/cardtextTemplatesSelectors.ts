import { RootState } from '@app/state'
import type { CardtextTemplate } from '../../domain/templates/types'

export const selectCardtextAddTemplateOpen = (state: RootState): boolean =>
  state.cardtext.isAddTemplateOpen ?? false

export const selectCardtextEditTitleOpen = (state: RootState): boolean =>
  state.cardtext.isEditTitleOpen ?? false

export const selectCardtextListSortDirection = (
  state: RootState,
): 'asc' | 'desc' => state.cardtext.cardtextListSortDirection ?? 'asc'

export const selectCardtextTemplatesListItems = (
  state: RootState,
): CardtextTemplate[] | null => state.cardtext.templatesList ?? null

export const selectCardtextTemplatesListLoading = (state: RootState): boolean =>
  state.cardtext.templatesListLoading === true
