import React, { JSX } from 'react'
import type { LayoutOrientation } from '@layout/domain/types'

interface IconCardProps extends React.SVGProps<SVGSVGElement> {
  orientation: LayoutOrientation
}

const icons: Record<LayoutOrientation, JSX.Element> = {
  portrait: (
    <>
      <path d="M877 186h244c56 0 101 45 101 101v707c0 55-45 101-101 101H414m-254-1h-2c-55 0-101-45-101-101V286c0-55 46-101 101-101h707c4 0 8 1 12 1m-719 908 256 1" />
      <path d="M57 938l324-323c60-58 134-58 194 0l324 323" />
      <path d="M769 809l65-65c60-57 134-57 194 0l195 194" />
    </>
  ),
  landscape: (
    <>
      <path d="M1094 877v245c0 55-45 100-101 100l-707 1c-56-1-101-46-101-101V415m1-254v-3c0-55 45-101 101-101h707c55 0 100 46 100 101v719M186 158l-1 257" />
      <path d="M185 873l253-252c47-46 105-46 151 0l253 252" />
      <path d="M741 772l51-50c47-45 104-45 151 0l152 151" />
    </>
  ),
}

export const IconCardDynamic: React.FC<IconCardProps> = ({
  orientation,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1280 1280"
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {icons[orientation]}
    </svg>
  )
}
