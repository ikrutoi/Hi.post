import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const strokeCap = {
  strokeLinecap: 'round' as const,
}

export const IconPostcardSend = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1590 1284"
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
        strokeWidth={107.837}
        d="M722 186h710c56 0 101 46 101 102v710c0 56-45 101-101 101H722"
      />
      <path
        {...strokeRound}
        strokeWidth={107.002}
        d="M57 384h504M426 900h135M243 642h318"
      />
      <path
        {...strokeCap}
        strokeWidth={107.837}
        d="m844 1097 232-455 426 426"
      />
      <path
        {...strokeCap}
        strokeWidth={107.837}
        d="m1502 1068-426-426 455-232"
      />
      <path
        {...strokeCap}
        strokeWidth={107.837}
        d="m1531 410-455 232-72-455"
      />
      <path
        {...strokeCap}
        strokeWidth={107.837}
        d="m859 608 217 34-232 455"
      />
    </g>
  </svg>
)
