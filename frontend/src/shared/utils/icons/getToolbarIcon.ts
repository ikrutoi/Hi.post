import { cloneElement } from 'react'
import { toolbarIcons } from '@shared/assets/icons'
import { IconKey } from '@shared/config/constants'
import type { JSX } from 'react'

export const getToolbarIcon = ({
  key,
  className = 'toolbarIcon',
  color,
  style = {},
}: {
  key: IconKey
  className?: string
  color?: string
  style?: React.CSSProperties
}): JSX.Element => {
  const icon = toolbarIcons[key]
  return cloneElement(icon, {
    className,
    style: {
      ...(color && { color }),
      ...style,
    },
  })
}
