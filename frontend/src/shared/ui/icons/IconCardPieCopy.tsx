import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconCardPieCopy = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1280 1280"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    stroke="currentColor"
    strokeWidth={107.498}
    {...props}
  >
    <path
      {...strokeRound}
      d="M867 1222H160c-56 0-101-45-101-101V414"
    />
    <path
      {...strokeRound}
      d="M316 863V157c0-56 45-101 101-101h706c56 0 101 45 101 101v706c0 56-45 101-101 101H417c-56 0-101-45-101-101"
    />
    <path strokeLinecap="round" d="m539 964 231-454 425 425" />
    <path strokeLinecap="round" d="m316 438 454 72-231 454" />
    <path strokeLinecap="round" d="M1195 935 770 510l454-231" />
    <path strokeLinecap="round" d="m698 56 72 454-454-72" />
    <path strokeLinecap="round" d="M1224 279 770 510 698 56" />
  </svg>
)
