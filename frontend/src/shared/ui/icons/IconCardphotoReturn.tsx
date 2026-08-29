import React from 'react'

/**
 * Cardphoto with return arrow. Source viewBox 1600×1440.
 * Uses `currentColor` so the toolbar can control color via CSS.
 */
export const IconCardphotoReturn = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1600 1440"
    fill="none"
    stroke="currentColor"
    strokeWidth={106.666}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M91 1234V528c0-56 46-101 101-101h707c56 0 101 45 101 101v706c0 56-45 101-101 101H192c-55 0-101-45-101-101" />
    <path d="m91 1083 253-253c47-45 105-45 152 0l252 253" />
    <path d="M647 981l51-50c47-45 105-45 151 0l152 152" />
    <path d="M663 105h574c60 0 109 49 109 109v576M1184 627l162 163M1509 627l-163 163" />
  </svg>
)
