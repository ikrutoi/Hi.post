import React from 'react'
import clsx from 'clsx'
import styles from './MobileFactorySectionFrame.module.scss'

export type MobileFactorySectionSurface =
  | 'cardphoto'
  | 'cardtext'
  | 'envelope'
  | 'envelope-sender'
  | 'aroma'
  | 'date'
  | 'date-cart'
  | 'date-history'
  | 'neutral'

type MobileFactorySectionFrameProps = {
  surface: MobileFactorySectionSurface
  showTemplateList: boolean
  templateList: React.ReactNode
  toolbar: React.ReactNode
  children: React.ReactNode
}

export const MobileFactorySectionFrame: React.FC<MobileFactorySectionFrameProps> = ({
  surface,
  showTemplateList,
  templateList,
  toolbar,
  children,
}) => (
  <div
    className={clsx(styles.frame, showTemplateList && styles.frameTemplateList)}
    data-mobile-section-surface={surface}
    data-mobile-factory-section-frame="true"
  >
    <div
      className={clsx(
        styles.content,
        showTemplateList && styles.contentTemplateList,
      )}
    >
      {showTemplateList ? (
        <div className={styles.listWrap}>
          <div className={styles.listPanelWrap}>{templateList}</div>
        </div>
      ) : (
        <>
          {toolbar}
          {children}
        </>
      )}
    </div>
  </div>
)
