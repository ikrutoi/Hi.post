import React from 'react'
import { useAppSelector } from '@app/hooks'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useCardtextViewToolbarContent } from './useCardtextViewToolbarContent'

/** Desktop factory lower row — View icons. Archive peek Copy is ArchivePeekLowerToolbar. */
export const DesktopCardtextViewToolbar: React.FC = () => {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const { rightPieCardtextPeekNoToolbar } = useRightListArchiveMini()
  const desktopCardtext = !isMobileLayout && activeSection === 'cardtext'
  const archivePeek = desktopCardtext && rightPieCardtextPeekNoToolbar
  const content = useCardtextViewToolbarContent({
    enabled: desktopCardtext && !archivePeek,
  })

  if (archivePeek || content == null) return null

  return content
}
