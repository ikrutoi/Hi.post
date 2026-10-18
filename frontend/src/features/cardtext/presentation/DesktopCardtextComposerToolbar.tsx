import React from 'react'
import { useAppSelector } from '@app/hooks'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsCardtextEditorComposerVisible } from '@cardtext/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import styles from './Cardtext.module.scss'

/** Desktop factory lower row — font, color, align, apply, close. */
export const DesktopCardtextComposerToolbar: React.FC = () => {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const composerVisible = useAppSelector(selectIsCardtextEditorComposerVisible)
  const { rightPieCardtextPeekNoToolbar } = useRightListArchiveMini()
  const desktopCardtext = !isMobileLayout && activeSection === 'cardtext'
  const show =
    desktopCardtext && !rightPieCardtextPeekNoToolbar && composerVisible

  if (!show) return null

  return (
    <div className={styles.cardtextViewToolbarRow}>
      <Toolbar section="cardtextEditor" />
    </div>
  )
}
