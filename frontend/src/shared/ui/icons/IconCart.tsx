import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconCart = (props: React.SVGProps<SVGSVGElement>) => (
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
      strokeWidth={107.498}
      {...strokeRound}
      d="M814 958H268c-43 0-78-35-78-78V334m0 0c0-43-35-78-78-78h-2m704 702h77M59 256h51"
    />
    <circle cx={344} cy={1168} r={104} fill="currentColor" />
    <circle cx={737} cy={1168} r={104} fill="currentColor" />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="M389 680V135c0-43 35-78 78-78h545c44 0 78 35 78 78v545c0 43-34 78-78 78H467c-43 0-78-35-78-78"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={106.666}
      {...strokeRound}
      d="m389 563 195-195c36-35 81-35 117 0l195 195"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={106.666}
      {...strokeRound}
      d="m818 485 39-39c36-35 81-35 117 0l117 117"
    />
  </svg>
)
