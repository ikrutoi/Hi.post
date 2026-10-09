import React from 'react'
import { useAppSelector } from '@app/hooks'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useCardphotoViewToolbarContent } from './useCardphotoViewToolbarContent'

/** Desktop factory lower row — View icons. Archive peek Copy is ArchivePeekLowerToolbar. */
export const DesktopCardphotoViewToolbar: React.FC = () => {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const { rightPieCardphotoPeekNoToolbar } = useRightListArchiveMini()
  const desktopCardphoto = !isMobileLayout && activeSection === 'cardphoto'
  const archivePeek = desktopCardphoto && rightPieCardphotoPeekNoToolbar
  const content = useCardphotoViewToolbarContent({
    enabled: desktopCardphoto && !archivePeek,
  })

  if (archivePeek || content == null) return null

  return content
}
