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
  /** Section template lists: square central zone + factory toolbar visible. */
  templateListInCentralZone?: boolean
  templateList: React.ReactNode
  toolbar: React.ReactNode
  /** Archive peek: keep toolbar band height for background layout, hide toolbar UI. */
  reserveToolbarBand?: boolean
  children: React.ReactNode
}

export const MobileFactorySectionFrame: React.FC<MobileFactorySectionFrameProps> = ({
  surface,
  showTemplateList,
  templateListInCentralZone = false,
  templateList,
  toolbar,
  reserveToolbarBand = false,
  children,
}) => {
  const showToolbarSlot = !showTemplateList || templateListInCentralZone
  const toolbarBandReserved = reserveToolbarBand && showToolbarSlot

  return (
  <div
    className={clsx(
      styles.frame,
      showTemplateList && !templateListInCentralZone && styles.frameTemplateList,
    )}
    data-mobile-section-surface={surface}
    data-mobile-factory-section-frame="true"
    data-mobile-factory-peek-band={reserveToolbarBand ? 'true' : undefined}
  >
    <div
      className={clsx(
        styles.content,
        showTemplateList &&
          !templateListInCentralZone &&
          styles.contentTemplateList,
      )}
    >
      {showTemplateList && templateListInCentralZone ? (
        <>
          <div className={styles.toolbarSlot}>{toolbar}</div>
          <div
            className={styles.centralWorkZone}
            data-mobile-central-work-zone="true"
          >
            <div className={styles.centralWorkZoneInner}>{templateList}</div>
          </div>
        </>
      ) : showTemplateList ? (
        <div className={styles.listWrap}>
          <div className={styles.listPanelWrap}>{templateList}</div>
        </div>
      ) : (
        <>
          <div
            className={clsx(
              styles.toolbarSlot,
              toolbarBandReserved && styles.toolbarSlotReserved,
            )}
            aria-hidden={toolbarBandReserved ? true : undefined}
          >
            {toolbarBandReserved ? null : toolbar}
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
}
