import React from 'react'

/** Стандартный холст иконок — 128×128, в SVG это 1280. Ширина 1440 рисуется пропорционально больше. */
const ARTBOARD_STANDARD = 1280
const ARTBOARD_SCALE = 1440 / ARTBOARD_STANDARD

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const strokeCap = {
  strokeLinecap: 'round' as const,
}

export const IconCart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1440 1360"
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
        strokeWidth={107.498}
        d="M476 866V159c0-56 45-101 101-101h706c56 0 101 45 101 101v707c0 56-45 101-101 101H577c-56 0-101-45-101-101"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m699 966 231-453 425 424"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m476 441 454 72-231 453"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="M1355 937 930 513l454-232"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m858 59 72 454-454-72"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="M1384 281 930 513 858 59"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="M373 1130C189 950 71 704 57 430"
      />
    </g>
    <circle cx={702} cy={1233} r={125} fill="currentColor" />
    <circle cx={1159} cy={1233} r={125} fill="currentColor" />
  </svg>
)
