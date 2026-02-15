import React from 'react'
import clsx from 'clsx'
import { useAssetRegistryFacade } from '@entities/assetRegistry/application/facade'
import { getToolbarIcon } from '@shared/utils/icons'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import styles from './CropPreviewItem.module.scss'

export const CropPreviewItem = React.memo(({ cropId }: { cropId: string }) => {
  const { getAssetById } = useAssetRegistryFacade()
  const asset = getAssetById(cropId)

  const { actions: cardphotoActions } = useCardphotoFacade()
  const { cropFromHistory, removeCropId } = cardphotoActions

  if (!asset) return <div className={styles.loader} />

  const imageUrl = asset.thumbUrl || asset.url

  return (
    <div className={styles.previewIconContainer}>
      <div
        className={styles.previewIcon}
        onClick={() => cropFromHistory(cropId)}
      >
        <img
          key={imageUrl}
          src={imageUrl}
          className={styles.previewImg}
          alt="crop"
        />
      </div>
      <div className={styles.previewButtonContainer}>
        <button
          className={styles.previewButtonDelete}
          onClick={(e) => {
            e.stopPropagation()
            removeCropId(cropId)
          }}
        >
          {getToolbarIcon({ key: 'deleteSmall' })}
        </button>
      </div>
    </div>
  )
})
