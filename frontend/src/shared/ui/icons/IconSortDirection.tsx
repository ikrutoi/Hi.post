import React from 'react'
import { IconSortUp } from './IconSortUp'
import { IconSortDown } from './IconSortDown'

export type SortDirection = 'asc' | 'desc'

export interface IconSortDirectionProps extends React.SVGProps<SVGSVGElement> {
  direction: SortDirection
}

export const IconSortDirection: React.FC<IconSortDirectionProps> = ({
  direction,
  ...props
}) =>
  direction === 'asc' ? <IconSortUp {...props} /> : <IconSortDown {...props} />
