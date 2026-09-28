import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const strokeCap = {
  strokeLinecap: 'round' as const,
}

/** Postcard with lock shackle — blocked cart date. */
export const IconPostcardBlocked = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1280 1440"
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
        strokeWidth={107.498}
        d="M901 319v157M379 320v-1c0-144 117-260 261-260s261 116 261 260v1m-522-1v157"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M186 1283V577c0-56 45-101 101-101h706c56 0 101 45 101 101v706c0 56-45 101-101 101H287c-56 0-101-45-101-101"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m409 1384 231-454 425 425"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m186 858 454 72-231 454"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="M1065 1355 640 930l454-231"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m568 476 72 454-454-72"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="M1094 699 640 930l-72-454"
      />
    </g>
  </svg>
)
