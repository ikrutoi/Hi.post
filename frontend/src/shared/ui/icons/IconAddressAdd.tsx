import React from 'react'

/**
 * Icon for adding an address to the envelope. Source viewBox 1280×1280.
 * Uses `currentColor` so the toolbar can control color via CSS.
 */
export const IconAddressAdd = (props: React.SVGProps<SVGSVGElement>) => (
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
    <ellipse cx={510} cy={626} rx={140} ry={141} fill="currentColor" stroke="none" />
    <path
      d="M306 1054s-36 3-45-36c-21-93 47-175 141-177 34-1 67 16 108 17 43 1 75-19 104-18 94 6 166 77 145 172-6 28-20 39-35 41s-418 1-418 1"
      fill="currentColor"
      stroke="none"
    />
    <path d="M965 65v500M715 315h500" strokeWidth={122.498} />
  </svg>
)
