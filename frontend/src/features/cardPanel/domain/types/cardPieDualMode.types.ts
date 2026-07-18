/**
 * Migration status:
 * - Step 1: contract + inventory
 * - Step 2: view isolation (mini open)
 * - Step 3a: assembly freeze lease (legacy session buffer)
 * - Step 3b (in progress): archiveEnvelopeSandbox for cart envelope —
 *   right mode never hydrates assembly sender/recipient for envelope
 * Target: full archive sandbox for all sections keyed by localId.
 */

/** Which postcard data branch the central/active CardPie is bound to. */
export type CardPieDataBranch = 'assembly' | 'archive'

/**
 * Assembly branch: in-progress postcard in session/editor slices.
 * No pipeline `PostcardStatus` until add-to-cart.
 */
export type CardPieAssemblyBranchRef = {
  branch: 'assembly'
}

/**
 * Archive branch: persisted postcard (cart / history) with identity + status.
 */
export type CardPieArchiveBranchRef = {
  branch: 'archive'
  localId: number
  source: 'cart' | 'history'
  status: import('@entities/postcard').PostcardStatus | undefined
}

export type CardPieBranchRef =
  | CardPieAssemblyBranchRef
  | CardPieArchiveBranchRef

/**
 * Interaction mode within a branch (orthogonal to which branch is shown).
 * - `view` — peek / simplified display; read-only toward the other branch
 * - `edit` — factory toolbars; writes must stay inside the active branch
 */
export type CardPieBranchInteraction = 'view' | 'edit'

export type CardPieDualModeSnapshot = {
  /** UI station: which pie face is shown. */
  activePieSide: 'left' | 'right'
  /** Data ownership for that face. */
  dataBranch: CardPieDataBranch
  interaction: CardPieBranchInteraction
  archive: CardPieArchiveBranchRef | null
}

/**
 * Write paths that currently couple archive → assembly session.
 * Step 2+ should retire or retarget these so assembly is never mutated from archive.
 */
export type CardPieDualModeWritePathId =
  | 'cardPieEdit.hydrateAll'
  | 'postcardEdit.hydrateSection'
  | 'rightPie.sectorClickWhileEdit'
  | 'rightPie.envelopePeekHydrate'
  | 'copyStrip.applySection'
  | 'copyStrip.applyAll'
  | 'miniCard.envelopeOpenApply'
  | 'archiveEdit.clearCardphotoApplied'
  | 'archiveEdit.clearCardtextApplied'

export type CardPieDualModeWritePath = {
  id: CardPieDualModeWritePathId
  /** Where the dispatch / effect lives. */
  locus: string
  /** What it writes today. */
  mutates: 'assemblySession'
  /** Intended dual-mode target after migration. */
  target: 'archiveSandbox' | 'explicitCopyBridge' | 'remove'
  note: string
}

export const CARD_PIE_DUAL_MODE_WRITE_PATHS: readonly CardPieDualModeWritePath[] =
  [
    {
      id: 'cardPieEdit.hydrateAll',
      locus: 'App.tsx → applyAllMirrorSectionsCopyRequested(clearCardphotoApplied)',
      mutates: 'assemblySession',
      target: 'archiveSandbox',
      note: 'Full archive edit hydrates all sections into shared session.',
    },
    {
      id: 'postcardEdit.hydrateSection',
      locus: 'App.tsx → applyArchiveSectionToEditorRequested(clear*Applied)',
      mutates: 'assemblySession',
      target: 'archiveSandbox',
      note: 'Section edit from peek clears session apply for cardtext/cardphoto.',
    },
    {
      id: 'rightPie.sectorClickWhileEdit',
      locus: 'App.tsx handleRightListPieSectorClick → applyArchiveSectionToEditorRequested',
      mutates: 'assemblySession',
      target: 'archiveSandbox',
      note: 'Sector switch during cardPieEdit re-hydrates that section into session.',
    },
    {
      id: 'rightPie.envelopePeekHydrate',
      locus:
        'App.tsx → loadArchiveEnvelopeSandbox (no session hydrate); Apply → persistArchiveEnvelopeSandbox',
      mutates: 'assemblySession',
      target: 'archiveSandbox',
      note:
        'Step 3b started: cart envelope uses archiveEnvelopeSandbox; assembly sender/recipient untouched.',
    },
    {
      id: 'copyStrip.applySection',
      locus: 'MiniSectionsSlot → applyArchiveSectionToEditorRequested / revertMirror*',
      mutates: 'assemblySession',
      target: 'explicitCopyBridge',
      note: 'Intentional copy right→left; keep as explicit bridge, not default edit.',
    },
    {
      id: 'copyStrip.applyAll',
      locus: 'MiniSectionsSlot → applyAllMirrorSectionsCopyRequested / revertAll*',
      mutates: 'assemblySession',
      target: 'explicitCopyBridge',
      note: 'cardPieCheck copy-all; same as applySection.',
    },
    {
      id: 'miniCard.envelopeOpenApply',
      locus: 'MiniCard.tsx (removed in dual-mode step 2)',
      mutates: 'assemblySession',
      target: 'remove',
      note:
        'Fixed: mini open no longer dispatches applyArchiveSectionToEditorRequested; gated by mayWriteAssemblyFromMiniOpen.',
    },
    {
      id: 'archiveEdit.clearCardphotoApplied',
      locus: 'applyArchiveSectionSaga clearCardphotoApplied → clearApply()',
      mutates: 'assemblySession',
      target: 'archiveSandbox',
      note: 'Empties assembly cardphoto sector while editing archive postcard.',
    },
    {
      id: 'archiveEdit.clearCardtextApplied',
      locus: 'applyArchiveSectionSaga clearCardtextApplied → setCardtextAppliedData(null)',
      mutates: 'assemblySession',
      target: 'archiveSandbox',
      note: 'Clears assembly cardtext apply during archive section edit.',
    },
  ] as const
