import type { Source } from '@shared/config/constants'
import type { CardSection } from '@entities/card/domain/types'

export type DuplicateResult = Record<Source, Record<CardSection, string[]>>
