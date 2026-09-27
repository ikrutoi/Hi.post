import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconCart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1280 1360"
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
      strokeLinecap="round"
      d="M262 1204c-49 0-89-36-95-78L56 581"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="M315 875V169c0-56 45-101 101-101h707c56 0 101 45 101 101v706c0 56-45 101-101 101H416c-56 0-101-45-101-101"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="m538 976 232-454 424 425"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="m316 450 454 72-232 454"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="M1194 947 770 522l453-231"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="m698 68 72 454-454-72"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="M1223 291 770 522 698 68"
    />
    <circle cx={541} cy={1227} r={125} fill="currentColor" />
    <circle cx={999} cy={1227} r={125} fill="currentColor" />
  </svg>
)
