import { Middleware } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import {
  setSectionComplete,
  clearSection,
} from '@entities/cardEditor/infrastructure/state'

import { setDate, clearDate } from '@date/infrastructure/state'
import { setAroma, clearAroma } from '@aroma/infrastructure/state'
import { setEnvelope, clearEnvelope } from '@envelope/infrastructure/state'

export const cardEditorSyncMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action)
    const dispatch = store.dispatch

    if (typeof action === 'object' && action && 'type' in action) {
      switch ((action as { type: string }).type) {
        case setDate.type:
          dispatch(setSectionComplete({ section: 'date', isComplete: true }))
          break
        case clearDate.type:
          dispatch(clearSection('date'))
          break

        case setAroma.type:
          dispatch(setSectionComplete({ section: 'aroma', isComplete: true }))
          break
        case clearAroma.type:
          dispatch(clearSection('aroma'))
          break

        case setEnvelope.type:
          dispatch(
            setSectionComplete({ section: 'envelope', isComplete: true })
          )
          break
        case clearEnvelope.type:
          dispatch(clearSection('envelope'))
          break
      }
    }

    return result
  }
