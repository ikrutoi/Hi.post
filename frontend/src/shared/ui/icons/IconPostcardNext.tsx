import React from 'react'

const sw0 = 107.498
const sw1 = 106.665

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
        strokeWidth={sw0}
        d="M1277 1220h140m0 0h118m-335 0h334m-220-220 220 220m0 0h-334zm1 0H748m0 0H314m507 0H65m1249-220-31-31"
      />
      <path
        {...strokeRound}
        strokeWidth={sw0}
        d="M66 868V162c0-55 45-100 101-100h705c56 0 101 45 101 100v706c0 55-45 100-101 100H167c-56 0-101-45-101-101"
      />
      <path
        {...strokeRound}
        strokeWidth={sw1}
        d="m66 716 252-252c47-45 105-45 152 0l252 252"
      />
      <path
        {...strokeRound}
        strokeWidth={sw1}
        d="m621 615 50-50c47-45 105-45 152 0l151 151"
      />
    </g>
  </svg>
)
