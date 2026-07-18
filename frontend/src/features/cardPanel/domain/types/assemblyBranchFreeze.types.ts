import type { CardPieSectionFlags } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import type { selectActiveCardFullData } from '@features/cardPie/infrastructure/selectors/cardPieSelectors'

/**
 * Dual-mode step 3: while archive-edit temporarily hydrates the shared session
 * (legacy), the assembly CardPie/plan pies keep showing this pre-edit snapshot.
 * Session is restored via mirrorSectionBackup on exit.
 */
export type AssemblyBranchFreeze = {
  editorData: ReturnType<typeof selectActiveCardFullData>
  sections: CardPieSectionFlags
}

export type AssemblyBranchFreezeState = {
  freeze: AssemblyBranchFreeze | null
}
