import React from 'react'

/** Две «панели истории» (контуры карточек + миниатюры). viewBox 2480×1240. */
export const IconHistoryPanel = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 2480 1240"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      strokeWidth={104.139}
      d="M1545 962V278c0-54 44-98 98-98h685c54 0 98 44 98 98v684c0 54-44 98-98 98h-685c-54 0-98-44-98-98"
    />
    <path
      strokeWidth={103.332}
      d="m1545 815 245-244c46-44 102-44 147 0l245 244M2084 717l49-49c45-43 101-43 147 0l147 147"
    />
    <path
      strokeWidth={104.139}
      d="M56 962V278c0-54 44-98 98-98h684c54 0 98 44 98 98v684c0 54-44 98-98 98H154c-54 0-98-44-98-98"
    />
    <path
      strokeWidth={103.332}
      d="m56 815 245-244c45-44 101-44 147 0l244 244"
    />
    <path
      strokeWidth={103.332}
      d="m594 717 49-49c46-43 102-43 147 0l147 147"
    />
    <path strokeWidth={103.332} d="M1240 305v630" />
  </svg>
)
