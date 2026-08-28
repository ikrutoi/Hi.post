import React from 'react'

/**
 * Cardphoto landscape with rotate-return arrows.
 * Uses `currentColor` so the toolbar can control color via CSS.
 */
export const IconCardphotoReturn = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 2080 1680"
    fill="none"
    stroke="currentColor"
    strokeWidth={106.666}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M584 1195V489c0-56 45-101 101-101h706c56 0 101 45 101 101v706c0 56-45 101-101 101H685c-56 0-101-45-101-101" />
    <path d="m584 1044 252-253c47-45 105-45 152 0l253 253" />
    <path d="M1140 942l50-50c47-45 105-45 152 0l151 152" />
    <path d="m418 1296-179-179M239 1117 59 1296M581 1610H348c-60 0-109-49-109-109v-301" />
    <path d="m1659 388 180 179M1839 567l179-179M1497 74h232c61 0 110 49 110 109v301" />
  </svg>
)
