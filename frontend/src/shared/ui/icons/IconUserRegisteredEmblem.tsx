import React from 'react'
import {
  IconUserRegisteredTriangles,
  type IconUserRegisteredTrianglesProps,
} from './IconUserRegisteredTriangles'
import { IconUserRegisteredWaves } from './IconUserRegisteredWaves'
import {
  resolveUserRegisteredEmblemForm,
  type UserRegisteredEmblemForm,
} from './iconUserRegisteredColors'

export type IconUserRegisteredEmblemProps = IconUserRegisteredTrianglesProps & {
  form?: UserRegisteredEmblemForm | null
}

/** Renders passport emblem geometry; colors come from `elementColors`. */
export const IconUserRegisteredEmblem = ({
  form,
  ...props
}: IconUserRegisteredEmblemProps) => {
  const resolvedForm = resolveUserRegisteredEmblemForm(form)

  if (resolvedForm === 'waves') {
    return <IconUserRegisteredWaves {...props} />
  }

  return <IconUserRegisteredTriangles {...props} />
}
