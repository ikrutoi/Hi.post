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

/** Upper dual toggle: left = sender, right = recipient. */
export type EnvelopeMobileDualSide = 'sender' | 'recipient'

type EnvelopeMobileAddressFocusContextValue = {
  focusRole: EnvelopeMobileAddressFocusRole | null
  toggleFocus: (role: EnvelopeMobileAddressFocusRole) => void
  clearFocus: () => void
  isFocused: (role: EnvelopeMobileAddressFocusRole) => boolean
  /**
   * Mobile factory dual toggle — which side is selected (accent + lower View).
   * Locked gray when both sender and recipient are Apply-peek; accent hidden then.
   */
  dualSide: EnvelopeMobileDualSide
  setDualSide: (side: EnvelopeMobileDualSide) => void
  /** Upper addressList flash after lower addList / removeFromList (View toolbar). */
  addressListFlashSide: EnvelopeMobileDualSide | null
  addressListFlashSeq: number
  triggerAddressListFlash: (side: EnvelopeMobileDualSide) => void
}

const EnvelopeMobileAddressFocusContext =
  createContext<EnvelopeMobileAddressFocusContextValue | null>(null)

export const EnvelopeMobileAddressFocusProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [focusRole, setFocusRole] =
    useState<EnvelopeMobileAddressFocusRole | null>(null)
  const [dualSide, setDualSide] = useState<EnvelopeMobileDualSide>('sender')
  const [addressListFlashSide, setAddressListFlashSide] =
    useState<EnvelopeMobileDualSide | null>(null)
  const [addressListFlashSeq, setAddressListFlashSeq] = useState(0)
  const clearSeq = useAppSelector(selectMobileAddressFocusClearSeq)

  const toggleFocus = useCallback((role: EnvelopeMobileAddressFocusRole) => {
    setFocusRole((prev) => (prev === role ? null : role))
  }, [])

  const clearFocus = useCallback(() => {
    setFocusRole(null)
  }, [])

  const triggerAddressListFlash = useCallback((side: EnvelopeMobileDualSide) => {
    setAddressListFlashSide(side)
    setAddressListFlashSeq((n) => n + 1)
  }, [])

  useEffect(() => {
    if (clearSeq > 0) {
      setFocusRole(null)
    }
  }, [clearSeq])

  /** Flash duration: 0.2s in + 0.2s out. */
  useEffect(() => {
    if (addressListFlashSeq === 0) return
    const id = window.setTimeout(() => {
      setAddressListFlashSide(null)
    }, 400)
    return () => window.clearTimeout(id)
  }, [addressListFlashSeq])

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
      addressListFlashSide,
      addressListFlashSeq,
      triggerAddressListFlash,
    }),
    [
      focusRole,
      toggleFocus,
      clearFocus,
      isFocused,
      dualSide,
      addressListFlashSide,
      addressListFlashSeq,
      triggerAddressListFlash,
    ],
  )

  return (
    <EnvelopeMobileAddressFocusContext.Provider value={value}>
      {children}
    </EnvelopeMobileAddressFocusContext.Provider>
  )
}

export const useEnvelopeMobileAddressFocus = () =>
  useContext(EnvelopeMobileAddressFocusContext)
