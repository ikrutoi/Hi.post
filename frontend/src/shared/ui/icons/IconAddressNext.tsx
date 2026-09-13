import React from 'react'

const sw = 107.498

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconAddressNext = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1600 1280"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    {...props}
  >
    <g fill="currentColor">
      <path d="M633 96C674 41 740 5 814 5c124 0 225 101 225 225S938 455 814 455c-39 0-76-10-107-27 0 0 32-84 13-177-20-93-87-155-87-155" />
      <circle cx="412" cy="319" r="225" />
      <path d="M84 1005s-57 4-72-58c-34-149 75-281 226-284 56-2 108 26 174 28 69 2 120-31 167-29 150 8 265 123 233 275-10 45-33 62-57 65-23 3-671 3-671 3" />
      <path d="M1078 914c-46 1-107 1-173 1 8-107-27-183-101-255s-195-84-195-84c10-1 20-2 31-3 55-1 107 27 173 29 69 1 120-31 168-29 122 7 221 84 236 194-68 22-121 78-139 147" />
    </g>
    <path
      {...strokeRound}
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      d="M1277 1220h140m0 0h118m-335 0h334m-220-220 220 220m0 0h-334zm1 0H748m0 0H314m507 0H65m1249-220-31-31"
    />
  </svg>
)
