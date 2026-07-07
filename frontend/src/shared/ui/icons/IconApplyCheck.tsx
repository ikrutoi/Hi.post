import React from 'react'

const swCheck = 137.499
const swFrame = 106.666

export const IconApplyCheck = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 1680 1280"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    {...props}
  >
    <path
      data-apply-part="check"
      d="M428 567l219 219 582-583"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={swCheck}
    />
    <path
      data-apply-part="frame"
      d="M1229 953v124c0 80-65 145-145 145l-874 1c-80-1-146-66-146-146V203c0-80 66-146 146-146h655"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={swFrame}
    />
    <path
      data-apply-part="check"
      d="M958 721l65 65 583-582"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={swCheck}
    />
  </svg>
)
