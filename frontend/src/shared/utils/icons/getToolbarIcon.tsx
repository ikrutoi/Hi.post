import { cloneElement } from 'react'
import { getIconByKey } from '@shared/assets/icons'
import { IconKey } from '@shared/config/constants'
import {
  IconDensity,
  IconFontSizeStep,
  IconHistoryPanelDensity,
  IconCheckBox,
  IconListCheck,
  IconPanelDensity2,
  IconSortDirection,
  type FontSizeStep,
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
  checkBoxChecked,
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
  /** Галочка для {@link IconCheckBox} (`checkBox`). */
  checkBoxChecked?: boolean
}): JSX.Element => {
  const iconProps = {
    className,
    style: { ...(color && { color }), ...style },
  }

  if (key === 'fontSizeIndicator') {
    const size = Math.min(5, Math.max(1, Math.round(step ?? 3))) as FontSizeStep
    return <IconFontSizeStep activeSize={size} {...iconProps} />
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

  if (key === 'checkBox') {
    return (
      <IconCheckBox checked={checkBoxChecked ?? false} {...iconProps} />
    )
  }

  return cloneElement(getIconByKey(key), iconProps)
}
