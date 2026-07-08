import { useCallback } from 'react'
import { useAppDispatch } from '@app/hooks'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'

/** Закрыть упрощённый peek секции архива и вернуть календарь / список корзины / истории. */
export function useCloseArchiveSectionPeek() {
  const dispatch = useAppDispatch()
  const {
    rightPieCardphotoPeekNoToolbar,
    rightPieCardtextPeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
    rightPieAromaPeekNoToolbar,
    rightPieDatePeekNoToolbar,
    clearRightPieCardphotoPeek,
    clearRightPieCardtextPeek,
    clearRightPieEnvelopePeek,
    clearRightPieAromaPeek,
    clearRightPieDatePeek,
  } = useRightListArchiveMini()

  const isArchiveSectionPeekActive =
    rightPieCardphotoPeekNoToolbar ||
    rightPieCardtextPeekNoToolbar ||
    rightPieEnvelopePeekNoToolbar ||
    rightPieAromaPeekNoToolbar ||
    rightPieDatePeekNoToolbar

  const closeArchiveSectionPeek = useCallback(() => {
    clearRightPieCardphotoPeek()
    clearRightPieCardtextPeek()
    clearRightPieEnvelopePeek()
    clearRightPieAromaPeek()
    clearRightPieDatePeek()
    dispatch(setActiveSection('date'))
  }, [
    clearRightPieAromaPeek,
    clearRightPieCardphotoPeek,
    clearRightPieCardtextPeek,
    clearRightPieDatePeek,
    clearRightPieEnvelopePeek,
    dispatch,
  ])

  return { closeArchiveSectionPeek, isArchiveSectionPeekActive }
}
