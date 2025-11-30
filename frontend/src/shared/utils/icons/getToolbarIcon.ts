import { cloneElement } from 'react'
import { toolbarIcons } from '@shared/assets/icons'
import { IconKey } from '@shared/config/constants'
import type { JSX } from 'react'

export const getToolbarIcon = ({
  key,
  className = 'toolbarIcon',
  size = '1.6rem',
  color,
  style = {},
}: {
  key: IconKey
  className?: string
  size?: string
  color?: string
  style?: React.CSSProperties
}): JSX.Element => {
  const icon = toolbarIcons[key]
  return cloneElement(icon, {
    className,
    style: {
      width: size,
      height: size,
      ...(color && { color }),
      ...style,
    },
  })
}
