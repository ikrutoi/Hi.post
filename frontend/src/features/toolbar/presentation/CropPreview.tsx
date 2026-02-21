import React, { useMemo } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades'
import { selectCropIds } from '@cardphoto/infrastructure/selectors'
import { CropPreviewItem } from './CropPreviewItem'
import styles from './CropPreview.module.scss'

export type CropPreviewVariant = 'toolbar' | 'panel'

export const CropPreview = React.memo(
  ({ variant = 'toolbar' }: { variant?: CropPreviewVariant }) => {
    const cropIds = useAppSelector(selectCropIds)
    const { sizeToolbarContour } = useSizeFacade()

    const reversed = useMemo(() => [...cropIds].reverse(), [cropIds])

    if (reversed.length === 0) return null

    const isPanel = variant === 'panel'

    return (
      <div
        className={clsx(styles.cropSidebar, isPanel && styles.cropSidebarPanel)}
        style={
          isPanel
            ? undefined
            : { left: `${sizeToolbarContour?.width ?? 0}px` }
        }
      >
        {reversed.map((id) => (
          <CropPreviewItem key={id} cropId={id} />
        ))}
      </div>
    )
  },
)
