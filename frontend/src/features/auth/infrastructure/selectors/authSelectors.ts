import type { RootState } from '@app/state'

export const selectAuthState = (state: RootState) => state.auth

export const selectAuthUser = (state: RootState) => state.auth.user

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated

export const selectAuthLoading = (state: RootState) => state.auth.loading

export const selectAuthError = (state: RootState) => state.auth.error

export const selectAuthInitialized = (state: RootState) =>
  state.auth.initialized

export const selectUserLoginPanelOpen = (state: RootState) =>
  state.auth.userLoginPanelOpen
