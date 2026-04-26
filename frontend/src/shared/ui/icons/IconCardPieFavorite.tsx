import React from 'react'

const sw = 107.498

export const IconCardPieFavorite = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1280 1280"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    shapeRendering="geometricPrecision"
    imageRendering="optimizeQuality"
    textRendering="geometricPrecision"
    {...props}
  >
    <g
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={sw}
    >
      <path d="M966 792v330c0 55-45 100-101 100l-707 1c-55-1-100-46-101-101V415c1-56 46-101 101-101h317" />
      <path d="m281 1222 231-454 454 454" />
      <path d="m58 696 454 72-231 454" />
      <path d="M966 1222 512 768l147-75" />
      <path d="m440 314 72 454-454-72" />
      <path strokeLinecap="round" d="m659 693-147 75-72-454" />
    </g>
    <path
      fill="currentColor"
      d="m1243 214-178-26-80-161c-14-29-56-29-70 0l-80 161-178 26c-32 5-45 44-22 67l129 126-30 177c-6 32 28 56 56 41l160-83 160 83c28 15 62-9 56-41l-30-177 129-126c23-23 10-62-22-67"
    />
  </svg>
)
