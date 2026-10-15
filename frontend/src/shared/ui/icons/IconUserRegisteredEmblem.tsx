import {
  IconUserRegisteredTriangles,
  type IconUserRegisteredTrianglesProps,
} from './IconUserRegisteredTriangles'

export type IconUserRegisteredEmblemProps = IconUserRegisteredTrianglesProps

/** Passport emblem. Colors come from `elementColors`. */
export const IconUserRegisteredEmblem = (
  props: IconUserRegisteredEmblemProps,
) => <IconUserRegisteredTriangles {...props} />
