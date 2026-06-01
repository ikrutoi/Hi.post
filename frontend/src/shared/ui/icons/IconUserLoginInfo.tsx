import React from 'react'

/** Круг с символом «i» — информация о профиле / аккаунте. */
export const IconUserLoginInfo = (props: React.SVGProps<SVGSVGElement>) => (
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
    <circle
      cx={640}
      cy={640}
      r={583}
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={194.998}
      d="M645 588v388"
    />
    <circle cx={640} cy={315} r={98} fill="currentColor" />
  </svg>
)
