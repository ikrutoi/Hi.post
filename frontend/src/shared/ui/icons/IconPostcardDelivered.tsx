import React from 'react'

/** Стандартный холст иконок — 128×128, в SVG это 1280. Холст 1440 рисуем пропорционально больше. */
const ARTBOARD_STANDARD = 1280
const ARTBOARD_SCALE = 1440 / ARTBOARD_STANDARD

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const strokeCap = {
  strokeLinecap: 'round' as const,
}

export const IconPostcardDelivered = (
  props: React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1440 1440"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    {...props}
    style={{ scale: ARTBOARD_SCALE, ...props.style }}
  >
    <g stroke="currentColor">
      <path
        {...strokeRound}
        strokeWidth={122.499}
        d="m704 293 189 190 423-423"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M1033 998v281c0 56-45 101-101 101H225c-55 0-101-45-101-101"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m347 1379 232-454 424 425"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m125 854 454 71-232 454"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m507 472 72 453-454-71"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M506 471H225c-55 0-101 45-101 101v707c0 56 46 101 101 101M1033 812v467"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M1003 1350 579 925l453-231 1 118"
      />
    </g>
  </svg>
)
