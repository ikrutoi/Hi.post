import React from 'react'

/**
 * Icon for adding cardphoto to the card pie.
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
    <path d="M1005 54v437" />
    <path d="M786 272h438" />

    <path d="M1005 749v369c0 58-47 106-106 106H161c-59 0-106-48-106-106V379c0-58 47-105 106-105h369" />

    <path d="m55 968 264-263c49-48 109-48 158 0l264 263" />
    <path d="M636 863l52-53c49-47 110-47 159 0l158 158" />
  </svg>
)

