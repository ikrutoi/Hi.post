import { useState, useRef } from 'react'
import type { AddressFields, EnvelopeRole } from '@shared/config/constants'
import { initialAddressFields } from '../../domain/models'

export const useEnvelopeLocalState = () => {
  const [value, setValue] = useState<Record<EnvelopeRole, AddressFields>>({
    sender: { ...initialAddressFields },
    recipient: { ...initialAddressFields },
  })

  const [memoryAddress, setMemoryAddress] = useState<
    Record<EnvelopeRole, { address: Record<string, string> }[] | null>
  >({
    sender: null,
    recipient: null,
  })

  const [countAddress, setCountAddress] = useState<
    Record<EnvelopeRole, number | null>
  >({
    sender: null,
    recipient: null,
  })

  const [stateMouseClip, setStateMouseClip] = useState<string | null>(null)
  // const [heightLogo, setHeightLogo] = useState<number | null>(null)

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
    countAddress,
    setCountAddress,
    stateMouseClip,
    setStateMouseClip,
    // heightLogo,
    // setHeightLogo,
    inputRefs,
    btnIconRefs,
    addressFieldsetRefs,
    addressLegendRefs,
    envelopeLogoRef,
  }
}
