import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import type { ActiveImageSource } from '@cardphoto/domain/types'
import { CardphotoView } from './CardphotoView/CardphotoView'
import styles from './Cardphoto.module.scss'

/**
 * After apply, saga sets `activeSource` to `apply` and image `status` to `outLine`
 * (see handleApplyAction). Relying only on `inLine` would wrongly show cardphotoCreate.
 */
const photoToolbarSection = (
  isProcessed: boolean,
  isInlineView: boolean,
  activeSource: ActiveImageSource | null,
) => {
  if (isInlineView || activeSource === 'apply') return 'cardphotoView'
  if (!isProcessed) return 'cardphotoCreate'
  return 'cardphotoProcessed'
}

export const Cardphoto = () => {
  const { activeImage, isProcessedMode, activeSource } = useCardphotoFacade()
  const hasLoadedPhoto = Boolean(activeImage)
  const isInlineView = activeImage?.status === 'inLine'

  return (
    <div className={styles.cardphoto}>
      <div className={styles.cardphotoViewWrap}>
        <div className={styles.cardphotoToolbarRow}>
          {hasLoadedPhoto ? (
            <Toolbar
              section={photoToolbarSection(
                isProcessedMode,
                isInlineView,
                activeSource,
              )}
            />
          ) : null}
        </div>
        <div className={styles.cardphotoViewContent}>
          <CardphotoView />
        </div>
      </div>
    </div>
  )
}
