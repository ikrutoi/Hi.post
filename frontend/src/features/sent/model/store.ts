import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { Sent } from './types'

export const sentStore = createStoreAdapter<Sent>('sent')
