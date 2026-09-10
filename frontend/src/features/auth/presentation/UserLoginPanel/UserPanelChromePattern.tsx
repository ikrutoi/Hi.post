import React, { useMemo } from 'react'
import clsx from 'clsx'
import {
  toPastelUserRegisteredElementColors,
  type IconUserRegisteredElementColors,
  type IconUserRegisteredElementId,
} from '@shared/ui/icons'
import styles from './UserPanelChromePattern.module.scss'

const DEFAULT_STROKE_WIDTH = 23.6221
const CELL_BORDER_STROKE = 'rgba(26, 26, 27, 0.16)'
const VIEWBOX_WIDTH = 20500
const VIEWBOX_HEIGHT = 1500

/** Horizontal stripe mosaic — two passport tiles (`el-1` … `el-48`). */
const USER_PANEL_CHROME_PATTERN_ELEMENTS = [
  { id: '1', d: 'M19208 20v730l1280-730z' },
  { id: '2', d: 'M19208 1480V750l-1279 730z' },
  { id: '3', d: 'M19208 1480V750l1280 730z' },
  { id: '4', d: 'M16649 1480V750l1280 730z' },
  { id: '5', d: 'M16649 1480V750l-1280 730z' },
  { id: '6', d: 'M16649 20v730l1280-730z' },
  { id: '7', d: 'M19208 20v730L17929 20z' },
  { id: '8', d: 'M16649 20v730L15369 20z' },
  { id: '9', d: 'm20488 1480-640-365-640-365 1280-730z' },
  { id: '10', d: 'm17929 1480-640-365-640-365 1280-730z' },
  { id: '11', d: 'm17929 1480 639-365 640-365-1279-730z' },
  { id: '12', d: 'm15369 1480 640-365 640-365-1280-730z' },
  { id: '13', d: 'M14089 20v730l1280-730z' },
  { id: '14', d: 'M14089 1480V750l-1279 730z' },
  { id: '15', d: 'M14089 1480V750l1280 730z' },
  { id: '16', d: 'M11530 1480V750l1280 730z' },
  { id: '17', d: 'M11530 1480V750l-1280 730z' },
  { id: '18', d: 'M11530 20v730l1280-730z' },
  { id: '19', d: 'M14089 20v730L12810 20z' },
  { id: '20', d: 'M11530 20v730L10250 20z' },
  { id: '21', d: 'm15369 1480-640-365-640-365 1280-730z' },
  { id: '22', d: 'm12810 1480-640-365-640-365 1280-730z' },
  { id: '23', d: 'm12810 1480 639-365 640-365-1279-730z' },
  { id: '24', d: 'm10250 1480 640-365 640-365-1280-730z' },
  { id: '25', d: 'M8970 20v730l1280-730z' },
  { id: '26', d: 'M8970 1480V750l-1280 730z' },
  { id: '27', d: 'M8970 1480V750l1280 730z' },
  { id: '28', d: 'M6411 1480V750l1279 730z' },
  { id: '29', d: 'M6411 1480V750l-1280 730z' },
  { id: '30', d: 'M6411 20v730L7690 20z' },
  { id: '31', d: 'M8970 20v730L7690 20z' },
  { id: '32', d: 'M6411 20v730L5131 20z' },
  { id: '33', d: 'm10250 1480-640-365-640-365 1280-730z' },
  { id: '34', d: 'm7690 1480-639-365-640-365L7690 20z' },
  { id: '35', d: 'm7690 1480 640-365 640-365L7690 20z' },
  { id: '36', d: 'm5131 1480 640-365 640-365L5131 20z' },
  { id: '37', d: 'M3851 20v730L5131 20z' },
  { id: '38', d: 'M3851 1480V750l-1280 730z' },
  { id: '39', d: 'M3851 1480V750l1280 730z' },
  { id: '40', d: 'M1292 1480V750l1279 730z' },
  { id: '41', d: 'M1292 1480V750L12 1480z' },
  { id: '42', d: 'M1292 20v730L2571 20z' },
  { id: '43', d: 'M3851 20v730L2571 20z' },
  { id: '44', d: 'M1292 20v730L12 20z' },
  { id: '45', d: 'm5131 1480-640-365-640-365L5131 20z' },
  { id: '46', d: 'm2571 1480-639-365-640-365L2571 20z' },
  { id: '47', d: 'm2571 1480 640-365 640-365L2571 20z' },
  { id: '48', d: 'm12 1480 640-365 640-365L12 20z' },
] as const

export type UserPanelChromePatternProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'color'
> & {
  /** Passport cell fills (`1`–`24`); stripe repeats the palette for `25`–`48`. */
  elementColors?: Partial<IconUserRegisteredElementColors> | null
  /** Outline color when a cell has no fill. */
  outlineColor?: string
  className?: string
}

function resolvePassportElementId(stripeElementId: string): IconUserRegisteredElementId {
  const numericId = Number.parseInt(stripeElementId, 10)
  const passportIndex = ((numericId - 1) % 24) + 1
  return String(passportIndex) as IconUserRegisteredElementId
}

function resolveElementPaint(
  stripeElementId: string,
  elementColors: Partial<IconUserRegisteredElementColors> | null | undefined,
  outlineColor: string,
) {
  const passportElementId = resolvePassportElementId(stripeElementId)
  const fillColor = elementColors?.[passportElementId]

  if (fillColor) {
    return {
      fill: fillColor,
      stroke: CELL_BORDER_STROKE,
    }
  }

  return {
    fill: 'none',
    stroke: outlineColor,
  }
}

/** Triangle mosaic stripe for user panel header / footer chrome. */
export const UserPanelChromePattern = ({
  elementColors,
  outlineColor = 'currentColor',
  className,
  ...props
}: UserPanelChromePatternProps) => {
  const pastelElementColors = useMemo(
    () =>
      elementColors != null
        ? toPastelUserRegisteredElementColors(elementColors)
        : null,
    [elementColors],
  )

  return (
    <div className={clsx(styles.root, className)} aria-hidden>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        fillRule="evenodd"
        clipRule="evenodd"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        {...props}
      >
        <g>
          {USER_PANEL_CHROME_PATTERN_ELEMENTS.map((element) => {
            const paint = resolveElementPaint(
              element.id,
              pastelElementColors,
              outlineColor,
            )

            return (
              <path
                key={element.id}
                data-el={element.id}
                d={element.d}
                fill={paint.fill}
                stroke={paint.stroke}
                strokeWidth={DEFAULT_STROKE_WIDTH}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}
