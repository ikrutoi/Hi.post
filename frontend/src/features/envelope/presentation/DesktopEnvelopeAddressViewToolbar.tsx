import React from 'react'
import { useAppSelector } from '@app/hooks'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { useEnvelopeAddressViewToolbarContent } from './useEnvelopeAddressViewToolbarContent'

/** Desktop factory lower row — same View icons as mobile scenario toolbar. */
export const DesktopEnvelopeAddressViewToolbar: React.FC = () => {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const { archiveCartEnvelopeSimplifiedPeek, archiveEditPeekGate } =
    useMobileFactoryListChrome()
  const { rightPieEnvelopePeekNoToolbar } = useRightListArchiveMini()
  const envelopePeekMode =
    (rightPieEnvelopePeekNoToolbar && !archiveCartEnvelopeSimplifiedPeek) ||
    archiveEditPeekGate
  const enabled =
    !isMobileLayout && activeSection === 'envelope' && !envelopePeekMode
  const content = useEnvelopeAddressViewToolbarContent({ enabled })

  if (content == null) return null

  return content
}
