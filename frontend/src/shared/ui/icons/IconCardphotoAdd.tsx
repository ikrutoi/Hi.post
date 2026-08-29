import React from 'react'

/**
 * Icon for adding cardphoto to the card pie. Source viewBox 1280×1280.
 * Uses `currentColor` so the toolbar can control color via CSS.
 */
export const IconCardphotoAdd = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1280 1280"
    fill="none"
    stroke="currentColor"
    strokeWidth={106.666}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M964 770v353c0 56-45 101-101 101H157c-56 0-101-45-101-101V417c0-56 45-101 101-101h353" />
    <path d="m56 980 252-252c47-45 105-45 152 0l252 252" />
    <path d="m611 879 50-50c47-45 105-45 152 0l151 151" />
    <path d="M965 65v500M715 315h500" strokeWidth={122.498} />
  </svg>
)
