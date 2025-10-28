import type { Source, Section } from '@shared/config/constants'

export type DuplicateResult = Record<Source, Record<Section, string[]>>
