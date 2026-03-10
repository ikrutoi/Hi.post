import { cloneElement } from 'react'
import { FontSizeIndicator } from '@toolbar/presentation/FontSizeIndicator'
import { getIconByKey } from '@shared/assets/icons'
import { IconKey } from '@shared/config/constants'
import { IconCardDynamic, IconSortDirection } from '@shared/ui/icons'
import type { JSX } from 'react'
import type { LayoutOrientation } from '@layout/domain/types'

export type SortDirection = 'asc' | 'desc'

export const getToolbarIcon = ({
  key,
  className,
  color,
  style = {},
  orientation,
  step,
  sortDirection,
}: {
  key: IconKey
  className?: string
  color?: string
  style?: React.CSSProperties
  orientation?: LayoutOrientation
  step?: number
  sortDirection?: SortDirection
}): JSX.Element => {
  const iconProps = {
    className,
    style: { ...(color && { color }), ...style },
  }

  if (key === 'cardOrientation') {
    return (
      <IconCardDynamic
        orientation={orientation ?? 'landscape'}
        {...iconProps}
      />
    )
  }

  if (key === 'fontSizeIndicator') {
    return <FontSizeIndicator currentStep={step ?? 3} {...iconProps} />
  }

  if (key === 'sortDown' && sortDirection != null) {
    return <IconSortDirection direction={sortDirection} {...iconProps} />
  }

  return <>{getIconByKey(key)}</>
}
