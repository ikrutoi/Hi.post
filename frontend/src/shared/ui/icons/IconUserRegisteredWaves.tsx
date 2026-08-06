import React from 'react'
import type {
  IconUserRegisteredElementColors,
  IconUserRegisteredElementId,
} from './iconUserRegisteredColors'

const DEFAULT_STROKE_WIDTH = 19.9961
const CELL_BORDER_STROKE = 'rgba(26, 26, 27, 0.42)'

type IconElement = {
  id: IconUserRegisteredElementId
  d: string
}

/**
 * Wave / sinusoidal grid — second passport emblem form (`el-1` … `el-23`).
 * Source SVG currently has no `el-24`.
 */
const ICON_USER_REGISTERED_WAVES_ELEMENTS: IconElement[] = [
  {
    id: '1',
    d: 'M1906 867c0-192-300-383-493-574 344-175 734-273 1147-273 0 282-654 564-654 847z',
  },
  {
    id: '2',
    d: 'M3214 867c0-283-654-565-654-847 413 0 803 98 1147 273-193 191-493 382-493 574z',
  },
  {
    id: '3',
    d: 'M1253 1713c0-260-557-521-643-781 221-264 494-482 803-639 193 191 493 382 493 574 0 282-653 564-653 846z',
  },
  {
    id: '4',
    d: 'M2560 1713c0-282 654-564 654-846 0-283-654-565-654-847 0 282-654 564-654 847 0 282 654 564 654 846z',
  },
  {
    id: '5',
    d: 'M3867 1713c0-282-653-564-653-846 0-192 300-383 493-574 309 157 582 375 803 639-86 260-643 521-643 781z',
  },
  {
    id: '6',
    d: 'M610 932c-247 296-429 650-521 1038 192 196 510 393 510 590 0-282 654-564 654-847 0-260-557-521-643-781z',
  },
  {
    id: '7',
    d: 'M1906 867c0 282-653 564-653 846 0 283 653 565 653 847 0-282 654-564 654-847 0-282-654-564-654-846z',
  },
  {
    id: '8',
    d: 'M3214 2560c0-282-654-564-654-847 0-282 654-564 654-846 0 282 653 564 653 846 0 283-653 565-653 847z',
  },
  {
    id: '9',
    d: 'M4510 932c247 296 429 650 521 1038-192 196-510 393-510 590 0-282-654-564-654-847 0-260 557-521 643-781z',
  },
  {
    id: '10',
    d: 'M89 1970c192 196 510 393 510 590s-318 394-510 590c-45-189-69-387-69-590s24-401 69-590z',
  },
  {
    id: '11',
    d: 'M1253 3407c0-283-654-565-654-847s654-564 654-847c0 283 653 565 653 847s-653 564-653 847z',
  },
  {
    id: '12',
    d: 'M2560 3407c0-283 654-565 654-847s-654-564-654-847c0 283-654 565-654 847s654 564 654 847z',
  },
  {
    id: '13',
    d: 'M3867 3407c0-283-653-565-653-847s653-564 653-847c0 283 654 565 654 847s-654 564-654 847z',
  },
  {
    id: '14',
    d: 'M5031 3150c45-189 69-387 69-590s-24-401-69-590c-192 196-510 393-510 590s318 393 510 590z',
  },
  {
    id: '15',
    d: 'M610 4188c-247-296-429-650-521-1038 192-196 510-393 510-590 0 282 654 564 654 847 0 260-557 520-643 781z',
  },
  {
    id: '16',
    d: 'M1906 4253c0-282-653-564-653-846 0-283 653-565 653-847 0 282 654 564 654 847 0 282-654 564-654 846z',
  },
  {
    id: '17',
    d: 'M3214 4253c0-282-654-564-654-846 0-283 654-565 654-847 0 282 653 564 653 847 0 282-653 564-653 846z',
  },
  {
    id: '18',
    d: 'M4510 4188c247-296 429-650 521-1038-192-197-510-393-510-590 0 282-654 564-654 847 0 260 557 520 643 781z',
  },
  {
    id: '19',
    d: 'M610 4190c221 264 494 482 803 639 193-191 493-382 493-573 0-283-653-565-653-847 0 260-557 521-643 781z',
  },
  {
    id: '20',
    d: 'M2560 5100c0-282-654-564-654-847 0-282 654-564 654-846 0 282 654 564 654 846 0 283-654 565-654 847z',
  },
  {
    id: '21',
    d: 'M4510 4188c-221 264-494 482-803 639-193-191-493-383-493-574 0-282 653-564 653-846 0 260 557 520 643 781z',
  },
  {
    id: '22',
    d: 'M1906 4253c0 283 654 565 654 847-413 0-803-98-1147-273 193-191 493-383 493-574z',
  },
  {
    id: '23',
    d: 'M2560 5100c413 0 803-98 1147-273-193-191-493-383-493-574 0 283-654 565-654 847z',
  },
]

export type IconUserRegisteredWavesProps = Omit<
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

export const IconUserRegisteredWaves = ({
  elementColors,
  outlineColor = 'currentColor',
  ...props
}: IconUserRegisteredWavesProps) => (
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
      {ICON_USER_REGISTERED_WAVES_ELEMENTS.map((element) => {
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
