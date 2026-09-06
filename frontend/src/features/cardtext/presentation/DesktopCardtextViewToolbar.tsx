import React from 'react'
import { useAppSelector } from '@app/hooks'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useCardtextViewToolbarContent } from './useCardtextViewToolbarContent'

/** Desktop factory lower row — same View icons as mobile scenario toolbar. */
export const DesktopCardtextViewToolbar: React.FC = () => {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const enabled = !isMobileLayout && activeSection === 'cardtext'
  const content = useCardtextViewToolbarContent({ enabled })

  if (content == null) return null

  return content
}
