import React from 'react'

/** Corner outline + × (remove from list). Source viewBox 0 0 1280 × 1280 */
export const IconRemoveFromList = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1280 1280"
    fill="none"
    stroke="currentColor"
    strokeWidth={107.498}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M314 161v-3c0-55 45-101 101-101h707c55 0 101 46 101 101v707c0 56-46 101-101 101h-2" />
    <path d="M759 521L264 1016M759 1016L264 521" />
  </svg>
)
