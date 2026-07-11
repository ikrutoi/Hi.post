import React from 'react'

const LETTER_A_FILL =
  'm541 486-23-62H317l-24 63c-9 25-17 42-23 50-7 9-17 13-32 13-13 0-24-4-34-13-9-10-14-20-14-32q0-9 3-21c3-7 6-17 11-30l127-320c3-9 8-20 13-33s10-24 16-32c6-9 13-16 22-21 10-5 21-8 35-8s25 3 35 8c9 5 17 12 22 20q9 12 15 27c4 9 9 22 15 38l129 319c10 24 15 42 15 53s-5 22-14 31c-10 10-21 14-35 14-8 0-15-1-20-4-6-3-10-6-14-11s-8-13-12-22q-7.5-15-12-27M343 349h148l-75-204z'
const LETTER_A_STROKE =
  'm541 486-23-62H317l-24 63c-9 25-17 42-23 50-7 9-17 13-32 13-13 0-24-4-34-13-9-10-14-20-14-32q0-9 3-21c3-7 6-17 11-30l127-320c3-9 8-20 13-33s10-24 16-32c6-9 13-16 22-21 10-5 21-8 35-8s25 3 35 8c9 5 17 12 22 20q9 12 15 27c4 9 9 22 15 38l129 319c10 24 15 42 15 53s-5 22-14 31c-10 10-21 14-35 14-8 0-15-1-20-4-6-3-10-6-14-11s-8-13-12-22q-7.5-15-12-27zM343 349h148l-75-204z'
const LETTER_Z_FILL =
  'm239 1129 254-303H275c-15 0-27-4-34-10q-12-10.5-12-27c0-11 4-21 12-28 7-7 19-10 34-10h281c36 0 55 17 55 50q0 25.5-9 39c-7 10-19 26-37 47l-237 282h261c15 0 27 4 35 10 7 6 11 15 11 27s-4 21-11 28c-8 7-20 10-35 10H268c-21 0-38-4-49-14s-16-23-16-39c0-6 1-11 2-16 2-5 5-9 8-13s7-10 12-16c6-6 10-12 14-17'
const LETTER_Z_STROKE = `${LETTER_Z_FILL}z`

export const IconSortAZDown = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path fill="currentColor" stroke="none" d={LETTER_A_FILL} />
    <path fill="none" strokeWidth={40.1346} d={LETTER_A_STROKE} />
    <path fill="currentColor" stroke="none" d={LETTER_Z_FILL} />
    <path fill="none" strokeWidth={40.1346} d={LETTER_Z_STROKE} />
    <path strokeWidth={130.652} d="m996 845 203 203 203-203M1199 1048V237" />
  </svg>
)
