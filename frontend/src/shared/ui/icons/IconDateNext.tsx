import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Calendar + next arrow. ViewBox 1600×1440 (not 1600×1280 like addressNext / cardPieNext). */
export const ICON_DATE_NEXT_ASPECT = 1600 / 1440

export const IconDateNext = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1600 1440"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={106.665}
      {...strokeRound}
      d="M63 311c0-63 51-113 114-113h680c63 0 114 50 114 113v681c0 62-51 113-114 113H177c-63 0-114-51-114-113zM744 84v227M290 84v227M63 538h908"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="M1279 1356h140m-421 0v-1m421 1h118m-335 0h334m-220-220 220 220m0 0h-334zm1 0H750m0 0H316m507 0H67m1249-220-31-31"
    />
  </svg>
)
