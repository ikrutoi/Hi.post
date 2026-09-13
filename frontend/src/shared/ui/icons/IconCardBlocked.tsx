import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Postcard/card with lock shackle — “card blocked” (e.g. cart date unavailable). */
export const IconCardBlocked = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1280 1600"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="M196 1439V749c0-54 44-98 99-98h689c55 0 99 44 99 98v690c0 54-44 98-99 98H295c-55 0-99-44-99-98"
    />
    <path
      stroke="currentColor"
      strokeWidth={106.666}
      {...strokeRound}
      d="m196 1290 247-246c46-44 102-44 148 0l246 246"
    />
    <path
      stroke="currentColor"
      strokeWidth={106.666}
      {...strokeRound}
      d="m739 1192 49-49c46-44 102-44 148 0l148 147"
    />
    <path
      stroke="currentColor"
      strokeWidth={107.498}
      d="M901 323v328M379 325v-2c0-144 117-260 261-260s261 116 261 260v2m-522-2v328"
    />
  </svg>
)
