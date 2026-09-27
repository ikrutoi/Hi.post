import React from 'react'

/** Стандартный холст иконок — 128×128, в SVG это 1280. Более крупный холст рисуем пропорционально больше. */
const ARTBOARD_STANDARD = 1280
const ARTBOARD_SCALE = 1440 / ARTBOARD_STANDARD

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const strokeCap = {
  strokeLinecap: 'round' as const,
}

export const IconPostcardReady = (props: React.SVGProps<SVGSVGElement>) => (
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
        d="m682 381 189 189 505-505"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M967 1003v281c0 55-45 101-101 101H159c-56 0-101-46-101-101"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m281 1384 232-454 424 425"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m59 858 454 72-232 454"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="M937 1355 513 930l252-129"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m441 477 72 453-454-72"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="M765 801 513 930l-72-453"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M440 476H159c-56 0-101 45-101 101v707c0 55 45 101 101 101M967 817v467"
      />
    </g>
  </svg>
)
