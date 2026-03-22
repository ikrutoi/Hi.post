import { cloneElement } from 'react'
import { FontSizeIndicator } from '@toolbar/presentation/FontSizeIndicator'
import { getIconByKey } from '@shared/assets/icons'
import { IconKey } from '@shared/config/constants'
import { IconCardDynamic, IconDensity, IconSortDirection } from '@shared/ui/icons'
import type { JSX } from 'react'
import type { LayoutOrientation } from '@layout/domain/types'

export type SortDirection = 'asc' | 'desc'

export type ListTemplateDensityCols = 4 | 5 | 6 | 7

export const getToolbarIcon = ({
  key,
  className,
  color,
  style = {},
  orientation,
  step,
  sortDirection,
  listTemplateDensityCols,
}: {
  key: IconKey
  className?: string
  color?: string
  style?: React.CSSProperties
  orientation?: LayoutOrientation
  step?: number
  sortDirection?: SortDirection
  /** Активный режим плотности сетки в панели списка шаблонов cardphoto. */
  listTemplateDensityCols?: ListTemplateDensityCols
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

  if (key === 'density') {
    return (
      <IconDensity
        activeCols={listTemplateDensityCols ?? 5}
        {...iconProps}
      />
    )
  }

  return <>{getIconByKey(key)}</>
}
