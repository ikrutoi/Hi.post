import { cloneElement } from 'react'
import { toolbarIcons } from '@shared/assets/icons'
import type { JSX } from 'react'
import type { ToolbarKey } from '@toolbar/domain/types'

interface ToolbarIconOptions {
  key: ToolbarKey
  className?: string
  size?: string
  color?: string
  style?: React.CSSProperties
}

export const getToolbarIcon = ({
  key,
  className = 'toolbar-icon',
  size = '1.2rem',
  color,
  style = {},
}: ToolbarIconOptions): JSX.Element | undefined => {
  const icon = toolbarIcons[key]
  return icon
    ? cloneElement(icon, {
        className,
        style: {
          width: size,
          height: size,
          color,
          ...style,
        },
      })
    : undefined
}
