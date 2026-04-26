import React from 'react'

const sw = 107.498

export const IconCardPie = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1280 1280"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    {...props}
  >
    <g
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={sw}
    >
      <path d="M59 1092V188c0-71 58-129 129-129h904c71 0 129 58 129 129v904c0 71-58 129-129 129H188c-71 0-129-58-129-129" />
      <path d="m344 1221 296-581 543 543" />
      <path d="m59 548 581 92-296 581" />
      <path d="M1183 1183 640 640l581-296" />
      <path d="m548 59 92 581-581-92" />
      <path d="M1221 344 640 640 548 59" />
    </g>
  </svg>
)
