import { cloneElement } from 'react'
import { toolbarIcons } from '@shared/assets/icons'
import { IconKey } from '@shared/config/constants'
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
  const icon = toolbarIcons[key]

  if (key === 'cardOrientation') {
    return cloneElement(icon, {
      className,
      orientation: orientation ?? 'landscape',
      style: {
        ...(color && { color }),
        ...style,
      },
    })
  }

  return cloneElement(icon, {
    className,
    style: {
      ...(color && { color }),
      ...style,
    },
  })
}
