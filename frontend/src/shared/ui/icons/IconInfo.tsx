import React from 'react'

/** Круг с символом «i». */
export const IconInfo = (props: React.SVGProps<SVGSVGElement>) => (
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
      fill="currentColor"
      fillRule="nonzero"
      d="M578 1015c-3 0-6-1-8-3-3-2-4-5-4-7V575c0-2 1-5 4-7 2-2 5-3 8-3h121c3 0 6 1 8 3 3 2 4 5 4 7v430c0 2-1 5-4 7-2 2-5 3-8 3zM640 427c-23 0-43-7-58-23-15-15-23-35-23-58 0-24 7-43 22-58 16-15 35-23 59-23s43 8 59 23c15 15 22 34 22 58 0 23-8 43-23 58-15 16-35 23-58 23"
    />
  </svg>
)
