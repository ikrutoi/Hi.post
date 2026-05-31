import React from 'react'

/** Пользователь в круге с плюсом — вход / создание аккаунта. */
export const IconUserLoginAdd = (props: React.SVGProps<SVGSVGElement>) => (
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
      strokeLinecap="round"
      strokeWidth={107.498}
      d="M1047 667c2 19 3 38 3 58 0 273-222 495-495 495S60 998 60 725s222-495 495-495c19 0 37 1 56 3"
    />
    <circle cx={555} cy={523} r={151} fill="currentColor" />
    <path
      fill="currentColor"
      d="M317 983c25 23-15-8-30-38-49-91 50-188 152-191 37-1 72 18 116 19 46 1 81-21 112-19 101 5 199 89 157 184-14 31-51 64-28 42-63 59-148 96-241 96s-177-36-238-93"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={106.666}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M1005 54v437M786 272h438"
    />
  </svg>
)
