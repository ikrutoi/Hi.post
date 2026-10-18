import React from 'react'
import { useAppSelector } from '@app/hooks'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import {
  selectIsCardtextEditorComposerVisible,
  selectIsCardtextListPanelOpen,
} from '@cardtext/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useCardtextViewToolbarContent } from './useCardtextViewToolbarContent'

/** Desktop factory lower row — View icons. Archive peek Copy is ArchivePeekLowerToolbar. */
export const DesktopCardtextViewToolbar: React.FC = () => {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const listOpen = useAppSelector(selectIsCardtextListPanelOpen)
  const composerVisible = useAppSelector(selectIsCardtextEditorComposerVisible)
  const { rightPieCardtextPeekNoToolbar } = useRightListArchiveMini()
  const desktopCardtext = !isMobileLayout && activeSection === 'cardtext'
  const archivePeek = desktopCardtext && rightPieCardtextPeekNoToolbar
  const content = useCardtextViewToolbarContent({
    enabled: desktopCardtext && !archivePeek,
    centerTitle: desktopCardtext && !archivePeek && listOpen,
  })

  if (archivePeek || composerVisible || content == null) return null

  return content
}
