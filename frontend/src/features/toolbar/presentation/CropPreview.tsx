import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectCropIds } from '@cardphoto/infrastructure/selectors'
import { CropPreviewItem } from './CropPreviewItem'
import styles from './CropPreview.module.scss'

export const CropPreview = React.memo(() => {
  const cropIds = useAppSelector(selectCropIds)
  console.log('CROP_PREVIEW cropIds', cropIds)

  const reversed = useMemo(() => [...cropIds].reverse(), [cropIds])

  if (reversed.length === 0) return null

  return (
    <div className={styles.cropSidebar}>
      {reversed.map((id) => (
        <CropPreviewItem key={id} cropId={id} />
      ))}
    </div>
  )
})
