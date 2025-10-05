import type { SOURCES, SECTIONS } from '../constants'

export type Source = (typeof SOURCES)[number]
export type Section = (typeof SECTIONS)[number]

export type DuplicateResult = Record<Source, Record<Section, string[]>>
