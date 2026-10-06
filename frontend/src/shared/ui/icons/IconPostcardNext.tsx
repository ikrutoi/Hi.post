import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconPostcardNext = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1600 1600"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    {...props}
  >
    <g stroke="currentColor">
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M1277 1277h140m117 0-251 251m134-251h118m-335 0h334m-220-220 220 220m1 0H748m0 0H314m507 0H65m1249-220-31-31m251 251h-334z"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M66 880V173c0-56 45-101 101-101h706c56 0 101 45 101 101v707c0 56-45 101-101 101H167c-56 0-101-45-101-101"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="m289 980 231-454 425 425"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="m66 455 454 71-231 454"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M945 951 520 526l454-231"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="m448 73 72 453-454-71"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M974 295 520 526 448 73"
      />
    </g>
  </svg>
)
