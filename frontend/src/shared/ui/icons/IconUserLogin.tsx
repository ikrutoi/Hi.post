import React from 'react'

/** Пользователь в круге — вход / аккаунт. */
export const IconUserLogin = (props: React.SVGProps<SVGSVGElement>) => (
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
    <circle cx={640} cy={403} r={178} fill="currentColor" />
    <path
      fill="currentColor"
      d="M360 943c30 28-17-9-36-44-57-107 60-222 179-225 44-1 85 21 137 23 55 1 95-25 132-23 119 7 234 105 184 217-16 36-59 75-33 49-73 70-173 113-283 113-109 0-208-43-280-110"
    />
  </svg>
)
