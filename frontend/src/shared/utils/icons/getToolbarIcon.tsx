import { cloneElement } from 'react'
import { FontSizeIndicator } from '@toolbar/presentation/FontSizeIndicator'
import { getIconByKey } from '@shared/assets/icons'
import { IconKey } from '@shared/config/constants'
import {
  IconDensity,
  IconHistoryPanelDensity,
  IconListCheck,
  IconPanelDensity2,
  IconSortDirection,
  type HistoryPanelDensitySize,
  type PanelDensity2Size,
} from '@shared/ui/icons'
import type { JSX } from 'react'

export type SortDirection = 'asc' | 'desc'

export type ListTemplateDensityCols = 4 | 5 | 6 | 7

export const getToolbarIcon = ({
  key,
  className,
  color,
  style = {},
  step,
  sortDirection,
  listTemplateDensityCols,
  historyPanelDensitySize,
  panelDensity2Size,
  listCheckTickChecked,
}: {
  key: IconKey
  className?: string
  color?: string
  style?: React.CSSProperties
  step?: number
  sortDirection?: SortDirection
  /** Активный режим плотности сетки в панели списка шаблонов cardphoto. */
  listTemplateDensityCols?: ListTemplateDensityCols
  /** Активная ступень плотности строк списка истории (`historyPanelDensity`). */
  historyPanelDensitySize?: HistoryPanelDensitySize
  panelDensity2Size?: PanelDensity2Size
  /** Зелёная галочка для {@link IconListCheck} (`listCheck`). */
  listCheckTickChecked?: boolean
}): JSX.Element => {
  const iconProps = {
    className,
    style: { ...(color && { color }), ...style },
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

  if (key === 'historyPanelDensity') {
    return (
      <IconHistoryPanelDensity
        activeSize={historyPanelDensitySize ?? 1}
        {...iconProps}
      />
    )
  }

  if (key === 'panelDensity2') {
    return (
      <IconPanelDensity2 activeSize={panelDensity2Size ?? 1} {...iconProps} />
    )
  }

  if (key === 'listCheck') {
    return (
      <IconListCheck tickChecked={listCheckTickChecked ?? false} {...iconProps} />
    )
  }

  return <>{getIconByKey(key)}</>
}
