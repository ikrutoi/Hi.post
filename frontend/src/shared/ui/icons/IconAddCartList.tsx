import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Корзина + плюс на «листе» (календарь), для списков. */
export const IconAddCartList = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M879 958H333c-44 0-78-35-78-78V334m0 0c0-43-35-78-79-78h-1m704 702h77M124 256h51"
    />
    <circle cx={409} cy={1168} r={104} fill="currentColor" />
    <circle cx={802} cy={1168} r={104} fill="currentColor" />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={106.666}
      {...strokeRound}
      d="M702 255v500M952 505H452"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="M454 136v-2c0-43 35-78 78-78h546c43 0 78 35 78 78v547c0 43-35 78-78 78h-1"
    />
  </svg>
)
