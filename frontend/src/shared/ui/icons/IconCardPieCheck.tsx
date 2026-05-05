import React from 'react'

const sw = 107.844
const swCheck = 107.008

export const IconCardPieCheck = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1560 1284"
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
      <path d="m310 1226 261-512 480 479" />
      <path d="M1051 1193 571 714l94-48" />
      <path d="m490 201 81 513-512-82" />
      <path d="M1084 778v334c0 63-51 114-114 114H172c-63 0-114-51-114-114V315c0-63 51-114 114-114h798c24 0 47 7 66 20" />
    </g>
    <path
      d="m719 413 213 214 570-569"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={swCheck}
    />
  </svg>
)
