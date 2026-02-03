import { cloneElement } from 'react'
import { FontSizeIndicator } from '@toolbar/presentation/FontSizeIndicator'
import { getIconByKey } from '@shared/assets/icons'
import { IconKey } from '@shared/config/constants'
import { IconCardDynamic } from '@shared/ui/icons'
import type { JSX } from 'react'
import type { LayoutOrientation } from '@layout/domain/types'

export const getToolbarIcon = ({
  key,
  className = 'toolbarIcon',
  color,
  style = {},
  orientation,
  step,
}: {
  key: IconKey
  className?: string
  color?: string
  style?: React.CSSProperties
  orientation?: LayoutOrientation
  step?: number
}): JSX.Element => {
  if (key === 'cardOrientation') {
    return (
      <IconCardDynamic
        orientation={orientation ?? 'landscape'}
        className={className}
        style={{ ...(color && { color }), ...style }}
      />
    )
  }
  if (key === 'fontSizeIndicator') {
    return (
      <div className={className} style={{ ...(color && { color }), ...style }}>
        <FontSizeIndicator currentStep={step ?? 3} />
      </div>
    )
  }

  const IconComponent = getIconByKey(key)

  return (
    <div className={className} style={{ ...(color && { color }), ...style }}>
      {IconComponent}
    </div>
  )
}
