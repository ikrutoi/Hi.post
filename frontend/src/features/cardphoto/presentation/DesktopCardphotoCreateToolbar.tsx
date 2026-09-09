import React from 'react'
import { useAppSelector } from '@app/hooks'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useCardphotoCreateToolbarContent } from './useCardphotoCreateToolbarContent'

/** Desktop factory lower row — same Create icons as mobile scenario toolbar. */
export const DesktopCardphotoCreateToolbar: React.FC = () => {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const enabled = !isMobileLayout && activeSection === 'cardphoto'
  const content = useCardphotoCreateToolbarContent({ enabled })

  if (content == null) return null

  return content
}
