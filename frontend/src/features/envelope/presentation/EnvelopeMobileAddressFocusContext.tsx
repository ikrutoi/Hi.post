import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

export type EnvelopeMobileAddressFocusRole = 'sender' | 'recipient'

type EnvelopeMobileAddressFocusContextValue = {
  focusRole: EnvelopeMobileAddressFocusRole | null
  toggleFocus: (role: EnvelopeMobileAddressFocusRole) => void
  clearFocus: () => void
  isFocused: (role: EnvelopeMobileAddressFocusRole) => boolean
}

const EnvelopeMobileAddressFocusContext =
  createContext<EnvelopeMobileAddressFocusContextValue | null>(null)

export const EnvelopeMobileAddressFocusProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [focusRole, setFocusRole] =
    useState<EnvelopeMobileAddressFocusRole | null>(null)

  const toggleFocus = useCallback((role: EnvelopeMobileAddressFocusRole) => {
    setFocusRole((prev) => (prev === role ? null : role))
  }, [])

  const clearFocus = useCallback(() => {
    setFocusRole(null)
  }, [])

  const isFocused = useCallback(
    (role: EnvelopeMobileAddressFocusRole) => focusRole === role,
    [focusRole],
  )

  const value = useMemo(
    () => ({
      focusRole,
      toggleFocus,
      clearFocus,
      isFocused,
    }),
    [focusRole, toggleFocus, clearFocus, isFocused],
  )

  return (
    <EnvelopeMobileAddressFocusContext.Provider value={value}>
      {children}
    </EnvelopeMobileAddressFocusContext.Provider>
  )
}

export const useEnvelopeMobileAddressFocus = () =>
  useContext(EnvelopeMobileAddressFocusContext)
