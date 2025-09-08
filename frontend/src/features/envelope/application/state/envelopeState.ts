import { useState, useRef } from 'react'
import { initialAddress } from '@envelope/domain'
import type { Address, AddressRole } from '@envelope/domain'

export const useEnvelopeState = () => {
  const [value, setValue] = useState<Record<AddressRole, Address>>({
    sender: { ...initialAddress },
    recipient: { ...initialAddress },
  })

  const [memoryAddress, setMemoryAddress] = useState<
    Record<AddressRole, { address: Record<string, string> }[] | null>
  >({
    sender: null,
    recipient: null,
  })

  const [btnsAddress, setBtnsAddress] = useState<
    Record<AddressRole, { save: boolean; delete: boolean; clip: boolean }>
  >({
    sender: { save: false, delete: false, clip: false },
    recipient: { save: false, delete: false, clip: false },
  })

  const [countAddress, setCountAddress] = useState<
    Record<AddressRole, number | null>
  >({
    sender: null,
    recipient: null,
  })

  const [stateMouseClip, setStateMouseClip] = useState<string | null>(null)
  const [heightLogo, setHeightLogo] = useState<number | null>(null)

  const inputRefs = useRef<Record<string, HTMLInputElement>>({})
  const btnIconRefs = useRef<Record<string, HTMLElement>>({})
  const addressFieldsetRefs = useRef<Record<string, HTMLFieldSetElement>>({})
  const addressLegendRefs = useRef<Record<string, HTMLLegendElement>>({})
  const envelopeLogoRef = useRef<HTMLDivElement | null>(null)

  return {
    value,
    setValue,
    memoryAddress,
    setMemoryAddress,
    btnsAddress,
    setBtnsAddress,
    countAddress,
    setCountAddress,
    stateMouseClip,
    setStateMouseClip,
    heightLogo,
    setHeightLogo,
    inputRefs,
    btnIconRefs,
    addressFieldsetRefs,
    addressLegendRefs,
    envelopeLogoRef,
  }
}
