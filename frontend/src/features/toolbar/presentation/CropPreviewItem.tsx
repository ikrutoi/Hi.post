import React, { useEffect } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import styles from './CropPreviewItem.module.scss'

export const CropPreviewItem = ({ cropId }: { cropId: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const { actions: cardphotoActions } = useCardphotoFacade()
  const { cropFromHistory } = cardphotoActions

  useEffect(() => {
    let isMounted = true

    const fetchCrop = async () => {
      const record = await storeAdapters.cropImages.getById(cropId)

      if (record && isMounted) {
        const src = record.thumbnail?.blob
          ? URL.createObjectURL(record.thumbnail.blob)
          : record.url

        setImageUrl(src)
      }
    }

    fetchCrop()

    return () => {
      isMounted = false
      if (imageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [cropId])

  const handleClickPreview = () => {
    cropFromHistory(cropId)
  }

  return (
    <div className={styles.previewIconContainer}>
      <div className={styles.previewIcon} onClick={handleClickPreview}>
        {imageUrl && (
          <img src={imageUrl} className={styles.previewImg} alt="crop" />
        )}
      </div>
    </div>
  )
}
