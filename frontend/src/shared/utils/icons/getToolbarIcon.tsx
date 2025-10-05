import { cloneElement } from 'react'
import type { JSX } from 'react'

import { toolbarIcons } from '@shared/assets/icons/toolbarIcons'
import type { IconKey } from '@shared/types'

export const getToolbarIcon = (
  key: IconKey,
  className = 'toolbar-icon'
): JSX.Element | undefined => {
  const icon = toolbarIcons[key]
  return icon ? cloneElement(icon, { className }) : undefined
}
