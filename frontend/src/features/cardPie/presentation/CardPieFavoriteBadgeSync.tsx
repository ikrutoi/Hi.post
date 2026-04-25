import React, { useEffect, useRef } from 'react'
import { useAppDispatch } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  cardPieFavoritesChangedEvent,
  listCardPieFavorites,
} from '../application/services/cardPieFavoritesService'

/**
 * Keeps `cardPieFavorite` badge in sectionEditorMenu in sync with local DB.
 */
export const CardPieFavoriteBadgeSync: React.FC = () => {
  const dispatch = useAppDispatch()
  const prevCount = useRef<number | undefined>(undefined)

  useEffect(() => {
    let cancelled = false

    const sync = async () => {
      const all = await listCardPieFavorites()
      if (cancelled) return
      const count = all.length
      if (prevCount.current === count) return
      prevCount.current = count
      dispatch(
        updateToolbarIcon({
          section: 'sectionEditorMenu',
          key: 'cardPieFavorite',
          value: {
            options: { badge: count > 0 ? count : null },
          },
        }),
      )
    }

    const onChanged = () => {
      void sync()
    }

    void sync()
    window.addEventListener(cardPieFavoritesChangedEvent, onChanged)

    return () => {
      cancelled = true
      window.removeEventListener(cardPieFavoritesChangedEvent, onChanged)
    }
  }, [dispatch])

  return null
}
