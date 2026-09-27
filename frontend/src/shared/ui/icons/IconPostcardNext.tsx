import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconPostcardNext = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1600 1280"
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
        d="M1277 1220h140m0 0h118m-335 0h334m-220-220 220 220m0 0h-334zm1 0H748m0 0H314m507 0H65m1249-220-31-31"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M66 868V162c0-56 45-101 101-101h706c56 0 101 45 101 101v706c0 56-45 101-101 101H167c-56 0-101-45-101-101"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="m289 969 231-454 425 425"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="m66 443 454 72-231 454"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M945 940 520 515l454-231"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="m448 61 72 454-454-72"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M974 284 520 515 448 61"
      />
    </g>
  </svg>
)
