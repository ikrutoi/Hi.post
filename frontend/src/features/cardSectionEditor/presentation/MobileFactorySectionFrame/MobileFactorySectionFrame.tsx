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
  /** Archive peek: keep toolbar band height for background layout, hide toolbar UI. */
  reserveToolbarBand?: boolean
  children: React.ReactNode
}

export const MobileFactorySectionFrame: React.FC<MobileFactorySectionFrameProps> = ({
  surface,
  showTemplateList,
  templateList,
  toolbar,
  reserveToolbarBand = false,
  children,
}) => (
  <div
    className={clsx(
      styles.frame,
      showTemplateList && styles.frameTemplateList,
    )}
    data-mobile-section-surface={surface}
    data-mobile-factory-section-frame="true"
    data-mobile-factory-peek-band={reserveToolbarBand ? 'true' : undefined}
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
          <div
            className={clsx(
              styles.toolbarSlot,
              reserveToolbarBand && styles.toolbarSlotReserved,
            )}
            aria-hidden={reserveToolbarBand ? true : undefined}
          >
            {reserveToolbarBand ? null : toolbar}
          </div>
          <div
            className={styles.centralWorkZone}
            data-mobile-central-work-zone="true"
          >
            <div className={styles.centralWorkZoneInner}>{children}</div>
          </div>
        </>
      )}
    </div>
  </div>
)
