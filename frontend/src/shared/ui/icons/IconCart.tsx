import React from 'react'

const strokeRound = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** New art is 1600 viewBox vs older 1280 icons — scale so the glyph matches toolbar weight. */
const CART_GLYPH_SCALE = 1.25

export const IconCart = ({
  style,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1600 1600"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    fill="currentColor"
    {...props}
    style={{
      transform: `scale(${CART_GLYPH_SCALE})`,
      transformOrigin: 'center',
      ...style,
    }}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="M591 871V165c0-56 45-101 101-101h707c56 0 101 45 101 101v706c0 56-45 101-101 101H692c-56 0-101-45-101-101"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={106.665}
      {...strokeRound}
      d="m591 720 253-253c47-45 105-45 152 0l252 253M1147 618l51-50c47-45 104-45 151 0l152 152"
    />
    <circle cx={671} cy={1468} r={125} fill="currentColor" />
    <circle cx={1234} cy={1468} r={125} fill="currentColor" />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={107.498}
      {...strokeRound}
      d="M243 493H99m144 0 207 695m546 0H450m546 0h77m-353 0h707"
    />
  </svg>
)
