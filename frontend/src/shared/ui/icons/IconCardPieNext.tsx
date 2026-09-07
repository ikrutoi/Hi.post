import React from 'react'

const sw = 107.498

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconCardPieNext = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1600 1600"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    stroke="currentColor"
    strokeWidth={sw}
    {...props}
  >
    <path
      {...strokeRound}
      d="M1278 1314h140m-421 0v-1m421 1h118m-335 0h334m-220-220 220 220m0 0h-334zm0 0-220 220m221-220H749m0 0H315m507 0H66"
    />
    <path
      {...strokeRound}
      d="M59 866V160c0-56 45-101 101-101h707c56 0 101 45 101 101v706c0 56-45 101-101 101H160c-56 0-101-45-101-101"
    />
    <path strokeLinecap="round" d="m282 967 231-454 425 425" />
    <path strokeLinecap="round" d="m60 441 453 72-231 454" />
    <path strokeLinecap="round" d="M938 938 513 513l454-231" />
    <path strokeLinecap="round" d="m442 59 71 454-453-72" />
    <path strokeLinecap="round" d="M967 282 513 513 442 59" />
  </svg>
)
