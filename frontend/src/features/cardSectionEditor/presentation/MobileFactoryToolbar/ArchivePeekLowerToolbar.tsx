import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { useArchivePeekCopy } from '../../application/hooks/useArchivePeekCopy'
import { useCloseArchiveSectionPeek } from '../../application/hooks/useCloseArchiveSectionPeek'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import styles from './ArchivePeekUpperToolbar.module.scss'

/**
 * Нижний ряд factory toolbar в archive peek (Корзина / История):
 * Copy слева, tint секции на всю полосу.
 */
export const ArchivePeekLowerToolbar: React.FC = () => {
  const activeSection = useAppSelector(selectActiveSection)
  const { isArchiveSectionPeekActive } = useCloseArchiveSectionPeek()
  const { showCopy, groupsOverride, handleCopyAction } = useArchivePeekCopy()
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

  if (!isArchiveSectionPeekActive) return null

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
      aria-hidden={showCopy ? undefined : true}
    >
      {showCopy ? (
        <div className={styles.sideLeft}>
          <Toolbar
            section={
              activeSection === 'cardtext'
                ? 'cardtext'
                : activeSection === 'envelope'
                  ? 'recipients'
                  : activeSection === 'aroma'
                    ? 'aroma'
                    : activeSection === 'date'
                      ? 'date'
                      : 'cardphoto'
            }
            groupsOverride={groupsOverride}
            onActionClick={handleCopyAction}
          />
        </div>
      ) : null}
    </div>
  )
}
