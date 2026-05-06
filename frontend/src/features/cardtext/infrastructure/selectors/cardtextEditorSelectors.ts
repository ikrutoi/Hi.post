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
import {
  deriveCardtextInteractionMode,
  type CardtextInteractionMode,
} from '../../domain/cardtextInteractionMode'
import { cardtextHasRenderableContent } from '../../domain/editor/editor.types'

const fallbackCardtextSessionContent: CardtextContent =
  createInitialCardtextContent()

const DEFAULT_CARDTEXT_LINES = fallbackCardtextSessionContent.cardtextLines

function cardtextValueHasUserText(value: CardtextValue | undefined | null): boolean {
  if (value == null || value.length === 0) return false
  return value.some((block) =>
    (block.children ?? []).some(
      (c) => String((c as { text?: string }).text ?? '').trim() !== '',
    ),
  )
}

/** Ветка для отображения в фабрике/мини: как в пироге — сначала applied, если в asset ещё нет текста. */
function displayCardtextBranch(
  asset: CardtextContent | null | undefined,
  applied: CardtextContent | null | undefined,
): CardtextContent | null {
  if (asset != null && cardtextValueHasUserText(asset.value)) return asset
  if (applied != null && cardtextValueHasUserText(applied.value)) return applied
  return asset ?? applied ?? null
}

function cloneCardtextValue(value: CardtextValue): CardtextValue {
  return value.map((b) => ({
    ...b,
    children: b.children.map((c) => ({ ...c })),
  }))
}

/**
 * Когда true — в фабрике берём только asset (черновик / заголовок в режиме правки).
 * Отсутствие asset не считается «черновиком»: тогда merge с applied, как в левом пироге.
 */
function isCardtextEditorAssetOnlyMerge(state: RootState): boolean {
  const { assetData, isCardtextViewEditMode } = state.cardtext
  if (isCardtextViewEditMode === true) return true
  return assetData != null && assetData.status === 'draft'
}

export const selectCardtextState = (state: RootState) => state.cardtext

export const selectCardtextSource = (
  state: RootState,
): 'draft' | 'view' => {
  if (state.cardtext.isCardtextViewEditMode === true) return 'draft'
  const { assetData, appliedData } = state.cardtext
  if (assetData == null) {
    if (
      appliedData != null &&
      cardtextValueHasUserText(appliedData.value)
    ) {
      return 'view'
    }
    return 'draft'
  }
  if (assetData.status === 'draft') return 'draft'
  return 'view'
}

export const selectIsDraftFocus = (state: RootState): boolean =>
  state.cardtext.isDraftFocus === true

export const selectCardtextDraftData = (
  state: RootState,
): CardtextCreateDraft | null => state.cardtext.draftData

export const selectCardtextValue = createSelector(
  [
    (state: RootState) => state.cardtext.assetData,
    (state: RootState) => state.cardtext.appliedData,
    isCardtextEditorAssetOnlyMerge,
  ],
  (asset, applied, isDraftLike): CardtextValue => {
    if (isDraftLike) {
      const v = asset?.value ?? initialCardtextValue
      return cloneCardtextValue(v)
    }
    const branch = displayCardtextBranch(asset, applied)
    if (branch == null) return initialCardtextValue
    return cloneCardtextValue(branch.value)
  },
)

export const selectCardtextPlainText = (state: RootState): string => {
  const { assetData, appliedData } = state.cardtext
  if (isCardtextEditorAssetOnlyMerge(state))
    return assetData?.plainText ?? ''
  const branch = displayCardtextBranch(assetData, appliedData)
  return branch?.plainText ?? ''
}

export const selectCardtextIsComplete = (state: RootState): boolean =>
  state.cardtext.appliedData != null

export const selectCardtextLines = (state: RootState): number => {
  const { assetData, appliedData } = state.cardtext
  if (isCardtextEditorAssetOnlyMerge(state)) {
    return assetData?.cardtextLines ?? DEFAULT_CARDTEXT_LINES
  }
  const branch = displayCardtextBranch(assetData, appliedData)
  return branch?.cardtextLines ?? DEFAULT_CARDTEXT_LINES
}

export const selectCardtextStyle = createSelector(
  [
    (state: RootState) => state.cardtext.assetData,
    (state: RootState) => state.cardtext.appliedData,
    isCardtextEditorAssetOnlyMerge,
  ],
  (asset, applied, isDraftLike): CardtextStyle => {
    if (isDraftLike) {
      return asset?.style ? { ...asset.style } : { ...defaultCardtextStyle }
    }
    const branch = displayCardtextBranch(asset, applied)
    return branch?.style ? { ...branch.style } : { ...defaultCardtextStyle }
  },
)

export const selectCardtextTitle = (state: RootState): string => {
  const { assetData, appliedData } = state.cardtext
  if (isCardtextEditorAssetOnlyMerge(state)) return assetData?.title ?? ''
  const branch = displayCardtextBranch(assetData, appliedData)
  return branch?.title ?? ''
}

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

/** Один производный режим для тулбара cardtext и ветвлений в саге. */
export const selectCardtextInteractionMode = createSelector(
  [
    selectCardtextAssetStatus,
    selectCardtextSource,
    selectCardtextId,
    (state: RootState) => state.cardtext.isCardtextViewEditMode === true,
  ],
  (
    cardtextAssetStatus,
    currentView,
    currentTemplateId,
    isCardtextViewEditMode,
  ): CardtextInteractionMode =>
    deriveCardtextInteractionMode({
      cardtextAssetStatus,
      currentView,
      currentTemplateId,
      isCardtextViewEditMode,
    }),
)

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

/**
 * Контент для мини-секции / `selectCardtextMiniPreviewHasRenderableContent`:
 * выбранный в списке шаблон (`inLine` / `outLine`) не попадает в превью, пока не нажат Apply —
 * до этого показываем только `appliedData` (то, что уже на открытке).
 */
export const selectCardtextDisplayForMiniStrip = createSelector(
  [
    (s: RootState) => s.cardtext.assetData,
    (s: RootState) => s.cardtext.appliedData,
    (s: RootState) => s.cardtext.isCardtextViewEditMode === true,
    selectCardtextAssetMatchesApplied,
  ],
  (asset, applied, isViewEditMode, assetMatchesApplied): CardtextContent => {
    const listBrowsingNotCommitted =
      asset != null &&
      (asset.status === 'inLine' || asset.status === 'outLine') &&
      !assetMatchesApplied

    let branch: CardtextContent | null = null

    if (listBrowsingNotCommitted) {
      branch = applied
    } else {
      const draftLike =
        isViewEditMode || (asset != null && asset.status === 'draft')
      if (draftLike) {
        branch = asset
      } else {
        branch = displayCardtextBranch(asset, applied)
      }
    }

    if (branch == null) {
      return {
        ...createInitialCardtextContent(),
        value: cloneCardtextValue(initialCardtextValue),
      }
    }

    return {
      ...createInitialCardtextContent(),
      id: branch.id,
      status: branch.status,
      value: cloneCardtextValue(branch.value),
      plainText: branch.plainText,
      style: { ...branch.style },
      title: branch.title ?? '',
      cardtextLines: branch.cardtextLines,
      favorite: branch.favorite,
      timestamp: branch.timestamp,
    }
  },
)

export const selectCardtextMiniPreviewHasRenderableContent = createSelector(
  [selectCardtextDisplayForMiniStrip],
  (preview) => cardtextHasRenderableContent(preview),
)

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
