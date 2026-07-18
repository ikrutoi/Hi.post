import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'

/** Активен ли упрощённый peek секции архива (корзина / история). */
export function useCloseArchiveSectionPeek() {
  const {
    rightPieCardphotoPeekNoToolbar,
    rightPieCardtextPeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
    rightPieAromaPeekNoToolbar,
    rightPieDatePeekNoToolbar,
  } = useRightListArchiveMini()

  const isArchiveSectionPeekActive =
    rightPieCardphotoPeekNoToolbar ||
    rightPieCardtextPeekNoToolbar ||
    rightPieEnvelopePeekNoToolbar ||
    rightPieAromaPeekNoToolbar ||
    rightPieDatePeekNoToolbar

  return { isArchiveSectionPeekActive }
}
