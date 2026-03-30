import { RootState } from '@app/state'
import {
  createInitialCardtextContent,
  defaultCardtextStyle,
  initialCardtextValue,
  type CardtextValue,
  type CardtextStyle,
  type CardtextContent,
  type CardtextStatus,
  type CardtextCreateDraft,
  type CardtextEditorSessionSnapshot,
  CARDTEXT_APPLIED_DISPLAY_STATUSES,
} from '../../domain/editor/editor.types'

import { createSelector } from '@reduxjs/toolkit'

const fallbackCardtextSessionContent: CardtextContent =
  createInitialCardtextContent()

const DEFAULT_CARDTEXT_LINES = fallbackCardtextSessionContent.cardtextLines

export const selectCardtextState = (state: RootState) => state.cardtext

export const selectCardtextSource = (
  state: RootState,
): 'draft' | 'view' =>
  state.cardtext.assetData == null ||
  state.cardtext.assetData.status === 'draft' ||
  state.cardtext.isCardtextViewEditMode === true
    ? 'draft'
    : 'view'

export const selectIsDraftFocus = (state: RootState): boolean =>
  state.cardtext.isDraftFocus === true

export const selectCardtextDraftData = (
  state: RootState,
): CardtextCreateDraft | null => state.cardtext.draftData

export const selectCardtextValue = createSelector(
  [(state: RootState) => state.cardtext.assetData],
  (asset): CardtextValue => asset?.value ?? initialCardtextValue,
)

export const selectCardtextPlainText = (state: RootState): string =>
  state.cardtext.assetData?.plainText ?? ''

export const selectCardtextIsComplete = (state: RootState): boolean =>
  state.cardtext.appliedData != null

export const selectCardtextLines = (state: RootState): number =>
  state.cardtext.assetData?.cardtextLines ?? DEFAULT_CARDTEXT_LINES

export const selectCardtextStyle = createSelector(
  [(state: RootState) => state.cardtext.assetData],
  (asset): CardtextStyle => asset?.style ?? defaultCardtextStyle,
)

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

/** Current editor `assetData` status (toolbar routing, processed-slot checks). */
export const selectCardtextAssetStatus = (state: RootState): CardtextStatus =>
  state.cardtext.assetData?.status ?? 'inLine'

/**
 * Merged “display” status: applied snapshot first, then asset.
 * Prefer `selectCardtextAssetStatus` when the UI must reflect the active editor row.
 */
export const selectCardtextStatus = (state: RootState) =>
  state.cardtext.appliedData?.status ??
  state.cardtext.assetData?.status ??
  'inLine'

/**
 * Same template id on asset and appliedData for processed / inLine / outLine —
 * Apply is “already on postcard”; otherwise enable Apply even if appliedData exists.
 */
export const selectCardtextAssetMatchesApplied = (
  state: RootState,
): boolean => {
  const applied = state.cardtext.appliedData
  const asset = state.cardtext.assetData
  if (applied == null || asset == null) return false
  if (!CARDTEXT_APPLIED_DISPLAY_STATUSES.has(asset.status)) return false
  const aid = asset.id
  const pid = applied.id
  if (aid == null || pid == null) return false
  return String(aid) === String(pid)
}

export const selectFontSizeStep = (state: RootState): number =>
  state.cardtext.assetData?.style?.fontSizeStep ??
  defaultCardtextStyle.fontSizeStep

export const selectFontFamily = (state: RootState): string =>
  state.cardtext.assetData?.style?.fontFamily ??
  defaultCardtextStyle.fontFamily

export const selectFontColor = (state: RootState): string =>
  state.cardtext.assetData?.style?.color ?? defaultCardtextStyle.color

export const selectCardtextSessionData = createSelector(
  [(state: RootState) => state.cardtext.assetData],
  (asset): CardtextContent => {
    if (asset == null) return fallbackCardtextSessionContent
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

export const selectCardtextPresetSessionData = createSelector(
  [(state: RootState) => state.cardtext.presetData],
  (preset): CardtextContent | null => {
    if (preset == null) return null
    return {
      ...preset,
      value: preset.value.map((b) => ({
        ...b,
        children: b.children.map((c) => ({ ...c })),
      })),
      style: { ...preset.style },
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

function cloneCardtextBranchNullable(
  c: CardtextContent | null,
): CardtextContent | null {
  if (c == null) return null
  return {
    ...c,
    value: c.value.map((b) => ({
      ...b,
      children: b.children.map((ch) => ({ ...ch })),
    })),
    style: { ...c.style },
  }
}

export const selectCardtextEditorSessionSnapshot = createSelector(
  [
    (state: RootState) => state.cardtext.assetData,
    (state: RootState) => state.cardtext.presetData,
    (state: RootState) => state.cardtext.appliedData,
    (state: RootState) => state.cardtext.draftData,
    (state: RootState) => state.cardtext.isCardtextViewEditMode,
  ],
  (
    assetData,
    presetData,
    appliedData,
    draftData,
    isCardtextViewEditMode,
  ): CardtextEditorSessionSnapshot => ({
    assetData: cloneCardtextBranchNullable(assetData),
    presetData: cloneCardtextBranchNullable(presetData),
    appliedData: cloneCardtextBranchNullable(appliedData),
    draftData: cloneCardtextBranchNullable(draftData),
    isCardtextViewEditMode,
  }),
)
