import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconPostcardDelivered = (
  props: React.SVGProps<SVGSVGElement>,
) => (
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
    <g stroke="currentColor">
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="m694 57 528 528h-117v410c0 65-52 117-116 118m0 0H765m160-824L694 57m0 0L167 585h117v124m179-420L694 57"
      />
      <path
        {...strokeRound}
        strokeWidth={122.498}
        d="m67 1024 189 190 422-423"
      />
    </g>
  </svg>
)
