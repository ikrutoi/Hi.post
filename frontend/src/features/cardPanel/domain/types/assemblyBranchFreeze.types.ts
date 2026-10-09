import type { ImageMeta } from '@cardphoto/domain/types'
import type { CardPieSectionFlags } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import type { selectActiveCardFullData } from '@features/cardPie/infrastructure/selectors/cardPieSelectors'

/**
 * Dual-mode: while archive face temporarily hydrates the shared session
 * (legacy edit buffer / peek), assembly CardPie and plan pies keep showing
 * this pre-hydrate snapshot. Session is restored via mirrorSectionBackup on
 * lease release (`endCardPieEditEngaged` / leave peek / return to left).
 */
export type AssemblyBranchFreezeReason = 'archiveEdit' | 'archivePeek'

export type AssemblyBranchFreeze = {
  editorData: ReturnType<typeof selectActiveCardFullData>
  sections: CardPieSectionFlags
  reason?: AssemblyBranchFreezeReason
  /**
   * Кардфото сборки до гидратации архива.
   * Mirror-backup к Apply может уже быть другим кадром.
   */
  cardphoto: {
    appliedData: ImageMeta | null
    assetData: ImageMeta | null
  }
}

/** Фото сборки, пока корзина правит общую сессию. */
export type FactoryCardphotoHold = {
  previewUrl: string
  thumbUrl: string | null
}

export type AssemblyBranchFreezeState = {
  freeze: AssemblyBranchFreeze | null
  factoryCardphotoHold: FactoryCardphotoHold | null
}

