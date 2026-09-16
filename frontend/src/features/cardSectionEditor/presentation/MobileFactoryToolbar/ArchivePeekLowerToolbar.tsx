import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { useCloseArchiveSectionPeek } from '../../application/hooks/useCloseArchiveSectionPeek'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import styles from './ArchivePeekUpperToolbar.module.scss'

/**
 * Нижний ряд factory toolbar в archive peek (Корзина / История):
 * только tint секции, без иконок (Copy в верхнем ряду справа).
 */
export const ArchivePeekLowerToolbar: React.FC = () => {
  const activeSection = useAppSelector(selectActiveSection)
  const { isArchiveSectionPeekActive } = useCloseArchiveSectionPeek()
  const {
    rightPieDatePeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
  } = useRightListArchiveMini()

  const aromaTint =
    isArchiveSectionPeekActive && activeSection === 'aroma'
  const cardtextTint =
    isArchiveSectionPeekActive && activeSection === 'cardtext'
  const cardphotoTint =
    isArchiveSectionPeekActive && activeSection === 'cardphoto'
  const dateTint = rightPieDatePeekNoToolbar
  const envelopeTint = rightPieEnvelopePeekNoToolbar

  return (
    <div
      className={clsx(
        styles.upperRow,
        aromaTint && styles.upperRowAroma,
        cardtextTint && styles.upperRowCardtext,
        cardphotoTint && styles.upperRowCardphoto,
        dateTint && styles.upperRowDate,
        envelopeTint && styles.upperRowEnvelope,
      )}
      aria-hidden
    />
  )
}
