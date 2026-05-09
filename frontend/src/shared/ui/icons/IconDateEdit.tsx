import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Calendar outline with pencil — change / edit dispatch date. */
export const IconDateEdit = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1280 1280"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    fill="currentColor"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={106.666}
      {...strokeRound}
      d="M1093 665v428c0 72-58 129-130 129l-776 1c-72-1-130-58-130-130V316c0-71 58-129 130-129h425M316 57v259M57 575h166"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="M1018 92c22-23 53-35 85-35 66 0 120 54 120 120 0 32-12 63-35 85L649 802l-227 56 56-227z"
    />
  </svg>
)
