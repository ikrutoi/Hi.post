import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Postcard/card with lock shackle — “card blocked” (e.g. cart date unavailable). */
export const IconCardBlocked = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M289 1145V600c0-43 35-78 78-78h545c44 0 78 35 78 78v545c0 43-34 78-78 78H367c-43 0-78-35-78-78"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={106.666}
      {...strokeRound}
      d="m289 1028 195-195c36-35 81-35 117 0l195 195"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={106.666}
      {...strokeRound}
      d="m718 950 39-39c36-35 81-35 117 0l117 117"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="M846 262v260M434 264v-2c0-113 92-206 206-206s206 93 206 206v2m-412-2v260"
    />
  </svg>
)
