import React, { JSX } from 'react'

import { iconMap, IconKey } from '@shared/configLegacy/iconMap'

export const getIconByKey = (key: IconKey): JSX.Element | undefined => {
  return iconMap[key]
}
