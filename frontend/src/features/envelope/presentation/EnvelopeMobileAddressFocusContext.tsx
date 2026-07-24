import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAppSelector } from '@app/hooks'
import { selectMobileAddressFocusClearSeq } from '@envelope/infrastructure/selectors'

export type EnvelopeMobileAddressFocusRole = 'sender' | 'recipient'

/** Upper dual toggle: left = sender, center = both simplified, right = recipient. */
export type EnvelopeMobileDualSide = 'sender' | 'both' | 'recipient'

type EnvelopeMobileAddressFocusContextValue = {
  focusRole: EnvelopeMobileAddressFocusRole | null
  toggleFocus: (role: EnvelopeMobileAddressFocusRole) => void
  clearFocus: () => void
  isFocused: (role: EnvelopeMobileAddressFocusRole) => boolean
  /**
   * Mobile factory dual toggle:
   * - sender / recipient — that side full View, other simplified
   * - both — both sides simplified (section kit complete view)
   */
  dualSide: EnvelopeMobileDualSide
  setDualSide: (side: EnvelopeMobileDualSide) => void
}

const EnvelopeMobileAddressFocusContext =
  createContext<EnvelopeMobileAddressFocusContextValue | null>(null)

export const EnvelopeMobileAddressFocusProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [focusRole, setFocusRole] =
    useState<EnvelopeMobileAddressFocusRole | null>(null)
  const [dualSide, setDualSide] = useState<EnvelopeMobileDualSide>('sender')
  const clearSeq = useAppSelector(selectMobileAddressFocusClearSeq)

  const toggleFocus = useCallback((role: EnvelopeMobileAddressFocusRole) => {
    setFocusRole((prev) => (prev === role ? null : role))
  }, [])

  const clearFocus = useCallback(() => {
    setFocusRole(null)
  }, [])

  useEffect(() => {
    if (clearSeq > 0) {
      setFocusRole(null)
    }
  }, [clearSeq])

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
      dualSide,
      setDualSide,
    }),
    [focusRole, toggleFocus, clearFocus, isFocused, dualSide],
  )

  return (
    <EnvelopeMobileAddressFocusContext.Provider value={value}>
      {children}
    </EnvelopeMobileAddressFocusContext.Provider>
  )
}

export const useEnvelopeMobileAddressFocus = () =>
  useContext(EnvelopeMobileAddressFocusContext)
