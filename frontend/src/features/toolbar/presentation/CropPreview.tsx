import React from 'react'
import clsx from 'clsx'
import { CropPreviewItem } from './CropPreviewItem'
import styles from './CropPreview.module.scss'

export const CropPreview = ({
  cropIdsReversed,
}: {
  cropIdsReversed: string[]
}) => {
  if (cropIdsReversed.length === 0) return null

  return (
    <div className={styles.cropSidebar}>
      {cropIdsReversed.map((id) => (
        <CropPreviewItem key={id} cropId={id} />
      ))}
    </div>
  )
}
