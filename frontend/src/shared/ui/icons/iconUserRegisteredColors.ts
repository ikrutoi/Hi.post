/** Element ids from IconUserRegistered SVG (`el-1` … `el-19`). */
export const ICON_USER_REGISTERED_ELEMENT_IDS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
] as const

export type IconUserRegisteredElementId =
  (typeof ICON_USER_REGISTERED_ELEMENT_IDS)[number]

/** Fill color per mosaic cell. */
export type IconUserRegisteredElementColors = Record<
  IconUserRegisteredElementId,
  string
>

/**
 * Fixed passport palette: el-N → color N.
 * Keep in sync with `$color-user-registered-*` in colors.scss.
 */
export const USER_REGISTERED_ELEMENT_HEX = [
  '#fbd04b',
  '#50d187',
  '#4896da',
  '#a973bf',
  '#f26156',
  '#fba72a',
  '#2ac4d8',
  '#e9437b',
  '#45a5f1',
  '#d2df59',
  '#fb7146',
  '#7f5ac0',
  '#90bd60',
  '#2aa59a',
  '#7682c8',
  '#b664c4',
  '#ee6e6c',
  '#49b2a8',
  '#8da0aa',
] as const

export const USER_REGISTERED_ELEMENT_COLORS =
  Object.fromEntries(
    ICON_USER_REGISTERED_ELEMENT_IDS.map((id, index) => [
      id,
      USER_REGISTERED_ELEMENT_HEX[index]!,
    ]),
  ) as IconUserRegisteredElementColors

/** Fixed mosaic colors — same layout for every registered user without a photo. */
export function getUserRegisteredElementColors(): IconUserRegisteredElementColors {
  return USER_REGISTERED_ELEMENT_COLORS
}
