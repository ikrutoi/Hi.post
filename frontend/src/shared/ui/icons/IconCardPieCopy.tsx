import React from 'react'

const sw = 107.498

export const IconCardPieCopy = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1280 1280"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    {...props}
  >
    <g
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={sw}
    >
      <path d="M968 1119v2c0 56-46 101-101 101H160c-56 0-101-45-101-101V414c0-56 45-101 101-101h2" />
      <path d="M316 863V157c0-56 45-101 101-101h706c56 0 101 45 101 101v706c0 56-45 101-101 101H417c-56 0-101-45-101-101" />
      <path d="m539 964 231-454 425 425" />
      <path d="m316 438 454 72-231 454" />
      <path d="M1195 935 770 510l454-231" />
      <path d="m698 56 72 454-454-72" />
      <path d="M1224 279 770 510 698 56" />
    </g>
  </svg>
)
