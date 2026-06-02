import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectAuthInitialized,
  selectIsAuthenticated,
} from '@features/auth/infrastructure/selectors/authSelectors'
import { fetchCloudBackupThunk } from '@features/sync/store'

export const useCloudBackupFetch = () => {
  const dispatch = useAppDispatch()
  const initialized = useAppSelector(selectAuthInitialized)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  useEffect(() => {
    if (!initialized || !isAuthenticated) return
    if (import.meta.env.VITE_AUTH_MODE !== 'http') return

    void dispatch(fetchCloudBackupThunk())
  }, [dispatch, initialized, isAuthenticated])
}
