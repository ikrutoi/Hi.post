import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectIsAuthenticated } from '@features/auth/infrastructure/selectors/authSelectors'
import { selectIsCardphotoCreateSession } from '@cardphoto/infrastructure/selectors/cardphotoUiSelectors'
import { isHttpAuthMode } from '@shared/config/authMode'
import { incrementAddressBookReloadVersion } from '@features/previewStrip/infrastructure/state'
import { pullV2PostcardsIntoIdb } from '../services/pullV2PostcardsIntoIdb'
import { pullV2LibraryIntoIdb } from '../services/pullV2LibraryIntoIdb'
import { pullAssemblySessionIntoIdb } from '../services/assemblySessionSync'
import {
  rehydrateAssemblySession,
  rehydratePostcardsFromIdb,
} from '../../store/postcardSync.actions'

/**
 * Idle poll while the screen stays open. Postcard edits are not a live chat:
 * another device is picked up on focus, when this tab becomes visible, and
 * on this slower tick. An open editor skips the pull entirely,
 * including a cardphoto create session that is not applied yet.
 */
const PULL_INTERVAL_MS = 30_000
/** Ignore a second interval tick that lands during / right after a pull. */
const MIN_PULL_GAP_MS = 4_000

/**
 * Keep this client in sync with /v2 while the same account is open elsewhere.
 * Login still does a full pull. This loop covers focus, tab-visible, and a
 * 30s idle poll. An open editor is left alone until it closes.
 */
export const useCloudBackupFetch = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const editing = useAppSelector(
    (state) =>
      state.cardPanel.archiveFactoryEditActive === true ||
      selectIsCardphotoCreateSession(state),
  )
  const inFlightRef = useRef(false)
  const lastPullAtRef = useRef(0)
  const editingRef = useRef(editing)
  const wasEditingRef = useRef(editing)
  const pullRef = useRef<((ignoreGap?: boolean) => Promise<void>) | null>(
    null,
  )
  editingRef.current = editing

  useEffect(() => {
    if (!isHttpAuthMode() || !isAuthenticated) return
    if (wasEditingRef.current && !editing) {
      void pullRef.current?.(true)
    }
    wasEditingRef.current = editing
  }, [editing, isAuthenticated])

  useEffect(() => {
    if (!isHttpAuthMode() || !isAuthenticated) return

    const pull = async (ignoreGap = false) => {
      if (editingRef.current || inFlightRef.current) return
      const now = Date.now()
      if (!ignoreGap && now - lastPullAtRef.current < MIN_PULL_GAP_MS) return
      inFlightRef.current = true
      lastPullAtRef.current = now
      try {
        try {
          await pullV2PostcardsIntoIdb()
        } catch {
          // Keep the cart already on screen.
        }
        try {
          await pullV2LibraryIntoIdb()
        } catch {
          // Templates stay as they were.
        }
        if (editingRef.current) return
        const assemblyChanged = await pullAssemblySessionIntoIdb()
        if (editingRef.current) return
        dispatch(rehydratePostcardsFromIdb())
        if (assemblyChanged) dispatch(rehydrateAssemblySession())
        dispatch(incrementAddressBookReloadVersion())
      } finally {
        inFlightRef.current = false
      }
    }
    pullRef.current = pull

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
      pullRef.current = null
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onFocus)
      window.clearInterval(intervalId)
    }
  }, [dispatch, isAuthenticated])
}
