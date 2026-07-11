import React from 'react'

const DIGIT_ONE_FILL =
  'M389 491V184c-57 44-95 66-115 66-9 0-18-4-25-11-7-8-11-16-11-26 0-12 4-20 11-26 7-5 20-12 38-20 27-13 49-27 65-41s31-30 43-47c13-18 21-29 25-33s11-6 22-6 21 5 28 14 11 22 11 38v386c0 45-15 67-46 67-14 0-25-4-33-14-9-9-13-22-13-40'
const DIGIT_ONE_STROKE = `${DIGIT_ONE_FILL}z`
const DIGIT_THREE_FILL =
  'M184 941c20 0 38-6 53-18s22-29 22-52q0-25.5-18-45-16.5-18-48-18c-13 0-25 2-33 5-9 4-16 9-22 15-5 7-10 15-14 25-5 10-9 19-13 28-2 4-6 8-12 11s-13 4-20 4c-9 0-17-4-25-11s-11-17-11-29 3-24 10-37c8-13 18-25 31-37 14-12 31-21 51-28s43-11 68-11c22 0 41 3 59 9s34 15 47 26q21 16.5 30 39c7 15 10 31 10 48 0 22-5 42-14 58-10 16-24 31-42 47 17 9 32 20 44 32s21 26 27 40q9 22.5 9 48c0 20-4 40-12 59q-12 28.5-36 51c-16 15-35 27-57 35s-46 13-73 13q-40.5 0-72-15c-21-9-39-22-53-36s-24-29-31-45c-7-15-11-28-11-38 0-13 4-24 13-32 8-8 19-12 31-12 7 0 13 2 19 6 5 4 9 8 11 13 12 31 24 55 38 70 13 15 32 22 56 22 14 0 27-3 40-10s24-17 32-30c9-14 13-29 13-47 0-26-7-47-22-62-14-15-34-22-60-22-4 0-11 0-21 1-9 1-15 1-18 1-12 0-22-3-28-9-7-6-10-15-10-26 0-10 4-19 12-26 8-6 20-10 36-10z'
const DIGIT_THREE_STROKE = DIGIT_THREE_FILL
const DIGIT_ONE_BOTTOM_FILL =
  'M599 1193V887c-57 44-95 65-115 65-10 0-18-3-25-11-8-7-11-16-11-26 0-11 3-20 11-25 7-6 19-13 38-21 27-13 49-26 65-40 16-15 30-30 43-48 13-17 21-28 25-32q6-6 21-6c12 0 22 4 29 14 7 9 11 21 11 38v385c0 45-16 68-46 68-14 0-25-5-33-14-9-9-13-23-13-41'
const DIGIT_ONE_BOTTOM_STROKE = `${DIGIT_ONE_BOTTOM_FILL}z`

export const IconSort131Down = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1470 1284"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    shapeRendering="geometricPrecision"
    {...props}
  >
    <path fill="currentColor" stroke="none" d={DIGIT_ONE_FILL} />
    <path fill="none" strokeWidth={40.1346} d={DIGIT_ONE_STROKE} />
    <path fill="currentColor" stroke="none" d={DIGIT_THREE_FILL} />
    <path fill="none" strokeWidth={40.1346} d={DIGIT_THREE_STROKE} />
    <path fill="currentColor" stroke="none" d={DIGIT_ONE_BOTTOM_FILL} />
    <path fill="none" strokeWidth={40.1346} d={DIGIT_ONE_BOTTOM_STROKE} />
    <path strokeWidth={130.652} d="m996 842 203 202 203-202M1199 1044V233" />
  </svg>
)
