import type { PostcardStatus } from '@entities/postcard'
import type { CardPieRightListSource } from '@features/cardPie/domain/types'
import type {
  CardPieArchiveBranchRef,
  CardPieBranchInteraction,
  CardPieDataBranch,
  CardPieDualModeSnapshot,
} from '@cardPanel/domain/types/cardPieDualMode.types'

export type ResolveCardPieDualModeInput = {
  activePieSide: 'left' | 'right'
  /** Archive postcard selected for the right face (cart/history row). */
  archiveLocalId: number | null
  archiveSource: CardPieRightListSource | null
  archiveStatus: PostcardStatus | undefined
  /**
   * True while factory edit of the archive postcard is engaged
   * (`cardPieEdit` / section edit from peek).
   */
  archiveEditEngaged: boolean
}

/**
 * Derives dual-mode ownership from UI station + archive selection.
 * Does not change behavior by itself — callers use this as the contract surface.
 */
export function resolveCardPieDualMode(
  input: ResolveCardPieDualModeInput,
): CardPieDualModeSnapshot {
  const {
    activePieSide,
    archiveLocalId,
    archiveSource,
    archiveStatus,
    archiveEditEngaged,
  } = input

  const dataBranch: CardPieDataBranch =
    activePieSide === 'right' ? 'archive' : 'assembly'

  const interaction: CardPieBranchInteraction =
    dataBranch === 'archive' && archiveEditEngaged ? 'edit' : 'view'

  const archive: CardPieArchiveBranchRef | null =
    archiveLocalId != null && archiveSource != null
      ? {
          branch: 'archive',
          localId: archiveLocalId,
          source: archiveSource,
          status: archiveStatus,
        }
      : null

  return {
    activePieSide,
    dataBranch,
    interaction,
    archive: dataBranch === 'archive' ? archive : null,
  }
}

/** True when UI shows archive face and must not write assembly session. */
export function isArchiveDataBranch(
  snapshot: Pick<CardPieDualModeSnapshot, 'dataBranch'>,
): boolean {
  return snapshot.dataBranch === 'archive'
}

/**
 * Today archive edit still mutates assembly (legacy). Use to mark call sites
 * that violate the dual-mode contract until sandbox lands.
 */
export function isLegacyArchiveEditMutatingAssembly(
  snapshot: CardPieDualModeSnapshot,
): boolean {
  return snapshot.dataBranch === 'archive' && snapshot.interaction === 'edit'
}

/**
 * Mini-strip open may write assembly session (restore photo/text slot, sync envelope).
 * Archive face / mirrored archive postcard: view stays read-only toward assembly.
 * Explicit copy uses mirrorApplyCorner; archive edit hydrate lives in App.tsx.
 */
export function mayWriteAssemblyFromMiniOpen(input: {
  dataBranch: CardPieDataBranch
  archiveEditEngaged: boolean
  peekToolbarOnMiniOpen: boolean
  mirrorTargetLocalId: number | null
}): boolean {
  if (input.peekToolbarOnMiniOpen) return false
  if (input.archiveEditEngaged) return false
  if (input.dataBranch === 'archive') return false
  if (input.mirrorTargetLocalId != null) return false
  return true
}
