import React, { useEffect } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { getToolbarIcon } from '@shared/utils/icons'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import styles from './CropPreviewItem.module.scss'

export const CropPreviewItem = React.memo(({ cropId }: { cropId: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const { actions: cardphotoActions } = useCardphotoFacade()
  const { cropFromHistory, removeCropId } = cardphotoActions

  useEffect(() => {
    let currentBlobUrl: string | null = null

    const fetchCrop = async () => {
      try {
        const record = await storeAdapters.cropImages.getById(cropId)

        if (record) {
          const src = record.thumbnail?.blob
            ? URL.createObjectURL(record.thumbnail.blob)
            : record.url

          if (src.startsWith('blob:')) {
            currentBlobUrl = src
          }

          setImageUrl(src)
        }
      } catch (error) {
        console.error('Failed to fetch crop from DB:', error)
      }
    }

    fetchCrop()

    return () => {
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl)
      }
    }
  }, [cropId])

  const handleClickPreview = () => {
    cropFromHistory(cropId)
  }

  const handleClear = () => {
    removeCropId(cropId)
  }

  return (
    <div className={styles.previewIconContainer}>
      <div className={styles.previewIcon} onClick={handleClickPreview}>
        {imageUrl && (
          <img
            src={imageUrl}
            id={`id-${cropId}`}
            className={styles.previewImg}
            alt="crop preview"
          />
        )}
      </div>
      <div className={styles.previewButtonContainer}>
        <button
          type="button"
          className={clsx(styles.previewButton, styles.previewButtonPlus)}
          // onClick={handleClear}
        >
          {getToolbarIcon({ key: 'plusSmall' })}
        </button>
        <button
          type="button"
          className={clsx(styles.previewButton, styles.previewButtonDelete)}
          onClick={handleClear}
        >
          {getToolbarIcon({ key: 'deleteSmall' })}
        </button>
      </div>
    </div>
  )
})
