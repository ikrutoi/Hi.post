import React, { useEffect } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import styles from './CropPreviewItem.module.scss'

import { storeAdapters } from '@db/adapters/storeAdapters'

export const CropPreviewItem = ({ cropId }: { cropId: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

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

  return (
    <div className={styles.previewIconContainer}>
      <div className={styles.previewIcon}>
        {imageUrl && (
          <img src={imageUrl} className={styles.previewImg} alt="crop" />
        )}
      </div>
    </div>
  )
}
