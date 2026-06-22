import React from 'react'
import type {
  IconUserRegisteredElementColors,
  IconUserRegisteredElementId,
} from './iconUserRegisteredColors'

const DEFAULT_STROKE_WIDTH = 23.6221
const CELL_BORDER_STROKE = 'rgba(26, 26, 27, 0.42)'

type IconElement = {
  id: IconUserRegisteredElementId
  d: string
}

const ICON_USER_REGISTERED_ELEMENTS: IconElement[] = [
  {
    id: '1',
    d: 'm3838 4749-640-365-640-365 1280-730z',
  },
  {
    id: '2',
    d: 'm1280 1831 640-365 640-365-1280-730z',
  },
  {
    id: '3',
    d: 'm1278 4749 640-365 640-365-1280-730z',
  },
  {
    id: '4',
    d: 'm2560 2561-640-365-640-365 1280-730z',
  },
  {
    id: '5',
    d: 'm2560 4020-640-365-640-365 1280-729z',
  },
  {
    id: '6',
    d: 'm2560 2561 640-365 640-365-1280-730z',
  },
  {
    id: '7',
    d: 'M5100 2549v21l-622 354-640 365V1830z',
  },
  {
    id: '8',
    d: 'M20 2549v23l620 353 640 365V1831z',
  },
  {
    id: '9',
    d: 'm3840 3290-640-365-640-364 1280-730z',
  },
  {
    id: '10',
    d: 'm1280 3290 640-365 640-364-1280-730z',
  },
  {
    id: '11',
    d: 'M3840 1831V371l-1280 730 640 365z',
  },
  {
    id: '12',
    d: 'm2560 4020 640-365 640-365-1280-729z',
  },
  {
    id: '13',
    d: 'm2561 4018-1286 731c373 223 813 351 1283 351V4019z',
  },
  {
    id: '14',
    d: 'M3842 370C3467 147 3028 20 2560 20v1081z',
  },
  {
    id: '15',
    d: 'm5100 2549-1260-718 927-529c210 368 331 794 333 1247z',
  },
  {
    id: '16',
    d: 'm3840 3288 640 365 287 164c-221 387-541 710-927 933z',
  },
  {
    id: '17',
    d: 'm353 1302 927 529 3-1464c-385 221-707 546-930 935z',
  },
  {
    id: '18',
    d: 'M353 3819C143 3451 22 3025 20 2572l1260 718-640 365z',
  },
  {
    id: '19',
    d: 'M2560 1101V20c-469 0-909 128-1283 350z',
  },
  {
    id: '20',
    d: 'M1280 1831 20 2549c2-453 123-879 333-1247l287 164z',
  },
  {
    id: '21',
    d: 'M2562 5097V4017l1278 733c-376 222-812 347-1278 347z',
  },
  {
    id: '22',
    d: 'M3832 364c385 219 711 546 935 938l-927 529z',
  },
  {
    id: '23',
    d: 'm4767 3817-927-529 1260-718c-2 453-123 879-333 1247z',
  },
  {
    id: '24',
    d: 'm353 3819 927-529 4 1465c-385-221-708-546-931-936z',
  },
]

export type IconUserRegisteredProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'color'
> & {
  /** Per-cell fill colors (`1`–`24`). Outline mode when omitted. */
  elementColors?: Partial<IconUserRegisteredElementColors>
  /** Outline color when `elementColors` is not set for a cell. */
  outlineColor?: string
}

function resolveElementPaint(
  id: IconUserRegisteredElementId,
  elementColors: Partial<IconUserRegisteredElementColors> | undefined,
  outlineColor: string,
) {
  const fillColor = elementColors?.[id]
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

export const IconUserRegistered = ({
  elementColors,
  outlineColor = 'currentColor',
  ...props
}: IconUserRegisteredProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 5120 5120"
    fillRule="evenodd"
    clipRule="evenodd"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    aria-hidden={props['aria-label'] == null ? true : undefined}
    {...props}
  >
    <g>
      {ICON_USER_REGISTERED_ELEMENTS.map((element) => {
        const paint = resolveElementPaint(
          element.id,
          elementColors,
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
)
