import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectIsAuthenticated } from '@features/auth/infrastructure/selectors/authSelectors'
import { isHttpAuthMode } from '@shared/config/authMode'
import { incrementAddressBookReloadVersion } from '@features/previewStrip/infrastructure/state'
import { pullV2PostcardsIntoIdb } from '../services/pullV2PostcardsIntoIdb'
import { pullV2LibraryIntoIdb } from '../services/pullV2LibraryIntoIdb'
import { rehydratePostcardsFromIdb } from '../../store/postcardSync.actions'

/** How often a visible tab asks the server for other-device edits. */
const PULL_INTERVAL_MS = 5_000
/** Ignore a second interval tick that lands during / right after a pull. */
const MIN_PULL_GAP_MS = 4_000

/**
 * Keep this client in sync with /v2 while the same account is open elsewhere.
 * Login still does a full pull; this loop covers focus, tab-visible, and idle poll.
 */
export const useCloudBackupFetch = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const inFlightRef = useRef(false)
  const lastPullAtRef = useRef(0)

  useEffect(() => {
    if (!isHttpAuthMode() || !isAuthenticated) return

    const pull = async (ignoreGap = false) => {
      if (inFlightRef.current) return
      const now = Date.now()
      if (!ignoreGap && now - lastPullAtRef.current < MIN_PULL_GAP_MS) return
      inFlightRef.current = true
      lastPullAtRef.current = now
      try {
        await pullV2PostcardsIntoIdb()
        await pullV2LibraryIntoIdb()
        dispatch(rehydratePostcardsFromIdb())
        dispatch(incrementAddressBookReloadVersion())
      } catch {
        // IndexedDB / Redux stay as they were.
      } finally {
        inFlightRef.current = false
      }
    }

    void pull(true)

    const onVisible = () => {
      if (document.visibilityState === 'visible') void pull(true)
    }
    const onFocus = () => {
      void pull(true)
    }

    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onFocus)
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') void pull()
    }, PULL_INTERVAL_MS)

    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onFocus)
      window.clearInterval(intervalId)
    }
  }, [dispatch, isAuthenticated])
}
