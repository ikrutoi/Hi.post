import React from 'react'
import type {
  IconUserRegisteredElementColors,
  IconUserRegisteredElementId,
} from './iconUserRegisteredColors'

const DEFAULT_STROKE_WIDTH = 7.03053
const ELEMENT_7_STROKE_WIDTH = 7.807
const CELL_BORDER_STROKE = 'rgba(26, 26, 27, 0.42)'

type IconElement =
  | {
      id: IconUserRegisteredElementId
      kind: 'circle'
      cx: number
      cy: number
      r: number
      strokeWidth?: number
    }
  | {
      id: IconUserRegisteredElementId
      kind: 'path'
      d: string
      strokeWidth?: number
    }

const ICON_USER_REGISTERED_ELEMENTS: IconElement[] = [
  {
    id: '19',
    kind: 'circle',
    cx: 649,
    cy: 647,
    r: 204,
  },
  {
    id: '18',
    kind: 'path',
    d: 'M791 150c-33-24-74-38-118-38-29 0-57 7-83 18-1-43-16-84-42-118C655-4 765 8 866 46c-13 42-39 78-75 104z',
  },
  {
    id: '17',
    kind: 'path',
    d: 'M1269 551c-16-115-63-220-133-307-14 26-34 49-57 66 72 50 105 140 81 224 26 12 55 19 86 19 8 0 15-1 23-2z',
  },
  {
    id: '16',
    kind: 'path',
    d: 'M1222 894c-40 91-100 171-175 233-27-36-41-80-40-125 58-24 103-75 119-137 28 17 61 28 96 29z',
  },
  {
    id: '15',
    kind: 'path',
    d: 'M760 1264c-39 7-79 11-120 11-79 0-154-14-224-41 13-38 36-72 67-97 37 34 86 56 141 56 34 0 66-9 94-23 6 35 20 67 42 94z',
  },
  {
    id: '14',
    kind: 'path',
    d: 'M133 1022c16-32 40-59 69-78-45-44-68-105-62-167-38-24-82-33-126-29 17 101 59 195 119 274z',
  },
  {
    id: '13',
    kind: 'path',
    d: 'M228 157C144 228 79 321 42 426c39-3 79 5 113 23 4-81 54-150 126-180-6-43-25-82-53-112z',
  },
  {
    id: '12',
    kind: 'path',
    d: 'M590 130c-62 28-108 87-119 157-56-37-128-44-190-18-6-43-25-82-53-112C317 81 427 29 548 12c25 33 41 73 42 118z',
  },
  {
    id: '11',
    kind: 'path',
    d: 'M1079 310c-33-22-73-35-115-35-32 0-61 7-88 19-6-59-38-111-85-144 35-26 62-62 75-104 107 41 200 110 270 198-14 26-34 49-57 66z',
  },
  {
    id: '10',
    kind: 'path',
    d: 'M1061 658c48-26 84-70 99-124 26 12 55 19 86 19 8 0 15-1 23-2 4 29 6 59 6 89 0 90-19 176-53 254-35-1-68-12-96-29q6-24 6-51c0-62-27-118-71-156z',
  },
  {
    id: '9',
    kind: 'path',
    d: 'M760 1264c108-21 206-69 287-137-27-36-41-80-40-125-58 24-125 20-179-10-1 77-45 144-110 178 6 35 20 67 42 94z',
  },
  {
    id: '8',
    kind: 'path',
    d: 'M416 1234c13-38 36-72 67-97-41-40-64-94-63-151-74 29-160 13-218-42-29 19-53 46-69 78 71 95 170 170 283 212z',
  },
  {
    id: '7',
    kind: 'path',
    d: 'M238 622c-54 32-91 89-98 155-38-24-82-33-126-29-18-107-9-219 28-322 39-3 79 5 113 23-2 68 28 132 83 173z',
    strokeWidth: ELEMENT_7_STROKE_WIDTH,
  },
  {
    id: '6',
    kind: 'path',
    d: 'M1061 658c44 38 71 94 71 156 0 112-91 204-204 204-105 0-192-80-203-182 74-30 127-101 128-186 32 21 70 33 111 33 35 0 68-9 97-25z',
  },
  {
    id: '5',
    kind: 'path',
    d: 'M420 986c-24 9-50 14-77 14-112 0-204-91-204-204s92-204 204-204c38 0 73 10 104 28-10 73 20 145 79 189-62 35-105 101-106 177z',
  },
  {
    id: '4',
    kind: 'path',
    d: 'M471 287c15-99 100-175 202-175 113 0 204 92 204 204 0 74-38 138-97 174-35-30-81-47-131-47-30 0-59 6-86 18 2-70-33-135-92-174z',
  },
  {
    id: '3',
    kind: 'path',
    d: 'M853 650c1-62-25-120-73-160 68-41 105-117 96-196 27-12 56-19 88-19 112 0 204 91 204 204 0 112-92 204-204 204-41 0-79-12-111-33z',
  },
  {
    id: '2',
    kind: 'path',
    d: 'M828 992c-2 111-92 201-204 201-113 0-204-92-204-204 0-78 43-145 106-180 34 26 77 42 123 42 27 0 53-5 76-15 8 67 47 124 103 156z',
  },
  {
    id: '1',
    kind: 'path',
    d: 'M563 461c-62 29-107 89-116 159-31-18-66-28-104-28s-74 11-105 30c-50-38-83-97-83-164 0-113 92-204 204-204 115 0 206 93 204 207z',
  },
]

export type IconUserRegisteredProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'color'
> & {
  /** Per-cell fill colors (`1`–`19`). Outline mode when omitted. */
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
    viewBox="0 0 1280 1280"
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
        const strokeWidth = element.strokeWidth ?? DEFAULT_STROKE_WIDTH

        if (element.kind === 'circle') {
          return (
            <circle
              key={element.id}
              data-el={element.id}
              cx={element.cx}
              cy={element.cy}
              r={element.r}
              fill={paint.fill}
              stroke={paint.stroke}
              strokeWidth={strokeWidth}
            />
          )
        }

        return (
          <path
            key={element.id}
            data-el={element.id}
            d={element.d}
            fill={paint.fill}
            stroke={paint.stroke}
            strokeWidth={strokeWidth}
          />
        )
      })}
    </g>
  </svg>
)
