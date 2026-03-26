import { RootState } from '@app/state'
import {
  createInitialCardtextContent,
  type CardtextValue,
  type CardtextStyle,
  type CardtextContent,
  type CardtextCreateDraft,
} from '../../domain/editor/editor.types'
import { createSelector } from '@reduxjs/toolkit'

export const selectCardtextState = (state: RootState) => state.cardtext

export const selectCardtextSource = (
  state: RootState,
): 'draft' | 'view' =>
  state.cardtext.assetData?.status === 'draft' ? 'draft' : 'view'

export const selectCardtextShowViewMode = (state: RootState): boolean =>
  selectCardtextSource(state) === 'view'

export const selectIsDraftFocus = (state: RootState): boolean =>
  state.cardtext.isDraftFocus === true

export const selectCardtextDraftData = (
  state: RootState,
): CardtextCreateDraft | null => state.cardtext.draftData

export const selectCardtextValue = (state: RootState): CardtextValue =>
  state.cardtext.assetData?.value ?? createInitialCardtextContent().value

export const selectCardtextPlainText = (state: RootState): string =>
  state.cardtext.assetData?.plainText ?? ''

export const selectCardtextIsComplete = (state: RootState): boolean =>
  state.cardtext.appliedData != null

export const selectCardtextLines = (state: RootState): number =>
  state.cardtext.assetData?.cardtextLines ??
  createInitialCardtextContent().cardtextLines

export const selectCardtextStyle = (state: RootState): CardtextStyle =>
  state.cardtext.assetData?.style ?? createInitialCardtextContent().style

export const selectCardtextTitle = (state: RootState): string =>
  state.cardtext.assetData?.title ?? ''

export const selectCardtextFavorite = (state: RootState): boolean => {
  const { assetData, templatesList } = state.cardtext
  const id = assetData?.id ?? null
  const favorite = assetData?.favorite ?? null
  if (id != null && Array.isArray(templatesList)) {
    const entry = templatesList.find((t: CardtextContent) => t.id === id)
    if (entry != null) return entry.favorite === true
  }
  return favorite === true
}

export const selectCardtextId = (state: RootState): string | null =>
  state.cardtext.assetData?.id ?? null

export const selectCardtextStatus = (state: RootState) =>
  state.cardtext.appliedData?.status ??
  state.cardtext.assetData?.status ??
  'inLine'

export const selectFontSizeStep = (state: RootState): number =>
  state.cardtext.assetData?.style.fontSizeStep ??
  createInitialCardtextContent().style.fontSizeStep

export const selectFontFamily = (state: RootState): string =>
  state.cardtext.assetData?.style.fontFamily ??
  createInitialCardtextContent().style.fontFamily

export const selectFontColor = (state: RootState): string =>
  state.cardtext.assetData?.style.color ??
  createInitialCardtextContent().style.color

export const selectCardtextSessionData = createSelector(
  [(state: RootState) => state.cardtext.assetData],
  (asset): CardtextContent => {
    if (asset == null) return createInitialCardtextContent()
    return {
      ...asset,
      value: asset.value.map((b) => ({
        ...b,
        children: b.children.map((c) => ({ ...c })),
      })),
      style: { ...asset.style },
    }
  },
)

export const selectCardtextAppliedSessionData = createSelector(
  [(state: RootState) => state.cardtext.appliedData],
  (applied): CardtextContent => {
    if (applied == null) return createInitialCardtextContent()
    return {
      ...applied,
      value: applied.value.map((b) => ({
        ...b,
        children: b.children.map((c) => ({ ...c })),
      })),
      style: { ...applied.style },
    }
  },
)
