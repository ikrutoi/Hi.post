import React from 'react'

/** Стандартный холст 128×128 — это 1280. Холст 1440 рисуется пропорционально больше. */
const ARTBOARD_STANDARD = 1280
const ARTBOARD_SCALE = 1440 / ARTBOARD_STANDARD

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const strokeCap = {
  strokeLinecap: 'round' as const,
}

export const IconPostcardError = (props: React.SVGProps<SVGSVGElement>) => (
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
        strokeWidth={107.498}
        d="M1019 998v281c0 56-45 101-101 101H212c-56 0-101-45-101-101"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m334 1380 231-454 425 425"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m111 854 454 72-231 454"
      />
      <path
        {...strokeCap}
        strokeWidth={107.498}
        d="m493 472 72 454-454-72"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M493 472H212c-56 0-101 45-101 101v706c0 56 45 101 101 101M1019 927v352"
      />
      <path
        {...strokeRound}
        strokeWidth={107.498}
        d="M990 1351 565 926l162-83"
      />
    </g>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M1019 2c207 0 375 168 375 375 0 208-168 375-375 375S644 585 644 377C644 170 812 2 1019 2m-45 458q-6 0-9-3c-3-2-4-5-4-9l-14-343q0-12 12-12h128q12 0 12 12l-15 343c0 4-1 7-4 9q-3 3-9 3zm42 202c-22 0-40-7-54-22-15-14-22-32-22-55 0-22 7-41 22-55q21-21 54-21c23 0 41 7 55 21 15 14 22 33 22 55s-7 40-22 55c-14 15-32 22-55 22"
    />
  </svg>
)
