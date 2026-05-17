import React from 'react'

/** Default tick color when `tickChecked` (matches `$color-indicator-hight`). */
export const ICON_LIST_CHECK_TICK_COLOR = '#4caf50'

export type IconListCheckProps = React.SVGProps<SVGSVGElement> & {
  /** When true, the tick path uses `tickColor` (green by default); list stays `currentColor`. */
  tickChecked?: boolean
  /** Tick stroke when `tickChecked`; defaults to {@link ICON_LIST_CHECK_TICK_COLOR}. */
  tickColor?: string
}

/**
 * Corner list outline + check mark. Source viewBox 0 0 1280 × 1280.
 * List and tick are separate paths so the tick can be tinted independently.
 */
export const IconListCheck = ({
  tickChecked = false,
  tickColor = ICON_LIST_CHECK_TICK_COLOR,
  ...props
}: IconListCheckProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1280 1280"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    imageRendering="optimizeQuality"
    {...props}
  >
    <path
      data-icon-part="list"
      stroke="currentColor"
      strokeWidth={107.498}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M314 161v-3c0-55 45-101 101-101h707c55 0 101 46 101 101v707c0 56-46 101-101 101h-2"
    />
    <path
      data-icon-part="tick"
      stroke={tickChecked ? tickColor : 'currentColor'}
      strokeWidth={106.666}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m58 777 238 239 637-637"
    />
  </svg>
)
