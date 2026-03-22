import React from 'react'

/** Три точки по вертикали — компактное меню действий. */
export const IconMoreVertical = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    {...props}
  >
    <circle cx="12" cy="3" r="3" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="21" r="3" />
  </svg>
)
