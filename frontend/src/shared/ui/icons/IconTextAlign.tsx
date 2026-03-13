import React from 'react'
import type { TextAlign } from '@/features/cardtext/domain/types'
import {
  IconAlignLeftV3,
  IconAlignCenterV3,
  IconAlignRightV3,
  IconAlignJustifyV3,
} from './index'

interface IconTextAlignProps extends React.SVGProps<SVGSVGElement> {
  align: TextAlign
}

export const IconTextAlign: React.FC<IconTextAlignProps> = ({ align, ...rest }) => {
  switch (align) {
    case 'center':
      return <IconAlignCenterV3 {...rest} />
    case 'right':
      return <IconAlignRightV3 {...rest} />
    case 'justify':
      return <IconAlignJustifyV3 {...rest} />
    case 'left':
    default:
      return <IconAlignLeftV3 {...rest} />
  }
}

