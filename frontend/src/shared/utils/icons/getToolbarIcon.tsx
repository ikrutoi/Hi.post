import { cloneElement } from 'react'
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
}: {
  key: IconKey
  className?: string
  color?: string
  style?: React.CSSProperties
  orientation?: LayoutOrientation
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

  const IconComponent = getIconByKey(key)

  return (
    <div className={className} style={{ ...(color && { color }), ...style }}>
      {IconComponent}
    </div>
  )
}
