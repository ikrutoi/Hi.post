import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  MouseEvent,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import './Envelope.scss'

import { AddressRole } from '@features/envelope/types'
import { ADDRESS_ROLES } from '@features/envelope/types'
import { useCurrentLang } from '@shared/localization/useCurrentLang'
import { loadEnvelopeTranslations } from '@shared/localization/loadTranslations'
import { setSavedCardId } from '@shared/layout/model'
import { addressLabels, AddressLabelsByLang } from '@i18n/index'
import { addEnvelope } from '@store/slices/cardEditSlice'
import { EnvelopeAddress, Mark, Toolbar } from '@features/envelope/publicApi'
import type { Address } from '@features/envelope/types'
import { initialAddress } from '@features/envelope/types'
import type { EnvelopeTranslations } from '@shared/localization/types'
import type { Lang } from '@i18n/index'

import {
  setDeleteSection,
  setChoiceClip,
  setActiveSections,
  setFullCardPersonalId,
  setExpendMemoryCard,
} from '@store/slices/layoutSlice'
import {
  getAllRecordsAddresses,
  getCountRecordsAddresses,
  getRecordAddressById,
  addUniqueRecordAddress,
} from '@utils/cardFormNav/indexDB/indexDb'
import { dbPromise } from '@utils/cardFormNav/indexDB/indexDb'
import { updateButtonsState } from '@store/slices/infoButtonsSlice'
import type { RootState } from '@store/index'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '@shared/ui/toolbar/handleMouse'
import { colorScheme } from '@shared/ui/toolbar/colorScheme'
import { changeIconStyles } from '@shared/ui/toolbar/changeIconStyles'
type EnvelopeProps = {
  cardPuzzleRef: React.RefObject<HTMLDivElement>
}

type MemoryAddressRecord = {
  address: Record<string, string>
}

export const EnvelopeView: React.FC<EnvelopeProps> = ({ cardPuzzleRef }) => {
  const lang = useCurrentLang()
  const fullCard = useSelector((state: RootState) => state.layout.fullCard)
  const cardEditEnvelope = useSelector(
    (state: RootState) => state.cardEdit.envelope
  )
  const layoutDeleteSection = useSelector(
    (state: RootState) => state.layout.deleteSection
  )
  const layoutChoiceClip = useSelector(
    (state: RootState) => state.layout.choiceClip
  )
  const layoutActiveSections = useSelector(
    (state: RootState) => state.layout.activeSections
  )
  const infoMiniAddressClose = useSelector(
    (state: RootState) => state.infoButtons.miniAddressClose
  )
  const layoutActiveEnvelope = useSelector(
    (state: RootState) => state.layout.activeSections.envelope
  )
  const infoExpendsMemoryCard = useSelector(
    (state: RootState) => state.layout.expendMemoryCard
  )

  // const [t, setT] = useState<EnvelopeTranslations | null>(null)
  const dispatch = useDispatch()

  const [value, setValue] = useState<Record<AddressRole, Address>>({
    sender: { ...initialAddress },
    recipient: { ...initialAddress },
  })

  const [memoryAddress, setMemoryAddress] = useState<
    Record<AddressRole, MemoryAddressRecord[] | null>
  >({
    sender: null,
    recipient: null,
  })

  function useEnvelopeTranslations(lang: Lang) {
    const [t, setT] = useState<EnvelopeTranslations | null>(null)

    useEffect(() => {
      loadEnvelopeTranslations(lang).then(setT)
    }, [lang])

    return t
  }

  const t = useEnvelopeTranslations(lang)

  const [btnsAddress, setBtnsAddress] = useState<
    Record<
      AddressRole,
      {
        save: boolean
        delete: boolean
        clip: boolean | keyof typeof colorScheme
      }
    >
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
  const addressFormRefs = useRef<Record<string, HTMLFormElement>>({})
  const addressFieldsetRefs = useRef<Record<string, HTMLFieldSetElement>>({})
  const addressLegendRefs = useRef<Record<string, HTMLLegendElement>>({})
  const envelopeLogoRef = useRef<HTMLDivElement | null>(null)

  const setInputRef = (id: string) => (element: HTMLInputElement | null) => {
    if (element) inputRefs.current[id] = element
  }

  const setBtnIconRef = (id: string) => (element: HTMLElement | null) => {
    if (element) btnIconRefs.current[id] = element
  }

  const setAddressFieldsetRef =
    (id: string) => (element: HTMLFieldSetElement | null) => {
      if (element) addressFieldsetRefs.current[id] = element
    }

  const setAddressLegendRef =
    (id: string) => (element: HTMLLegendElement | null) => {
      if (element) addressLegendRefs.current[id] = element
    }

  const handleValue = (role: AddressRole, input: string, val: string) => {
    setValue((state) => ({
      ...state,
      [role]: { ...state[role], [input]: val },
    }))
  }

  const handleMovingBetweenInputs = (evt: KeyboardEvent<HTMLInputElement>) => {
    const indexInput = Number(evt.currentTarget.dataset.index)
    const role = evt.currentTarget.dataset.role as AddressRole
    if (evt.key === 'ArrowDown' || evt.key === 'Enter') {
      inputRefs.current[`${role}${indexInput + 1}`]?.focus()
    }
    if (evt.key === 'ArrowUp') {
      inputRefs.current[`${role}${indexInput - 1}`]?.focus()
    }
  }

  const searchParentBtnNav = (el: HTMLElement): HTMLElement | null => {
    if (el.classList.contains('toolbar-btn')) return el
    return el.parentElement ? searchParentBtnNav(el.parentElement) : null
  }

  // useEffect(() => {
  //   loadEnvelopeTranslations(lang).then((translations) => {
  //     setT(translations)
  //   })
  // }, [lang])

  useEffect(() => {
    if (layoutDeleteSection === 'envelope') {
      clearSectionAddress('sender')
      clearSectionAddress('recipient')
      dispatch(setDeleteSection(null))
    }
  }, [layoutDeleteSection])

  useEffect(() => {
    if (
      !infoExpendsMemoryCard ||
      !['sender', 'recipient'].includes(infoExpendsMemoryCard.source)
    )
      return

    const fetchAddress = async () => {
      const addressById = await getRecordAddressById(
        infoExpendsMemoryCard.source,
        Number(infoExpendsMemoryCard.id)
      )

      if (addressById?.address) {
        setValue((prev) => ({
          ...prev,
          [infoExpendsMemoryCard.source]: {
            ...prev[infoExpendsMemoryCard.source],
            ...addressById.address,
          },
        }))
        dispatch(setExpendMemoryCard(null))
      }
    }

    fetchAddress()
  }, [infoExpendsMemoryCard])

  useEffect(() => {
    const checkField = (section: AddressRole) => {
      const fullAddress = Object.values(value[section]).every(
        (val) => val !== ''
      )
      const notEmptyAddress = Object.values(value[section]).some(
        (val) => val !== ''
      )
      setBtnsAddress((prev) => ({
        ...prev,
        [section]: { ...prev[section], delete: notEmptyAddress },
      }))

      if (section === 'recipient') {
        dispatch(
          setActiveSections({ ...layoutActiveSections, envelope: fullAddress })
        )
      }

      const parityToaddress = fullAddress
        ? changeParityInputsAddress(section)
        : false

      setBtnsAddress((prev) => ({
        ...prev,
        [section]: { ...prev[section], save: parityToaddress },
      }))
    }

    const getCountAddress = async (section: AddressRole) => {
      return await getCountRecordsAddresses(section)
    }

    const getMemory = async (section: AddressRole) => {
      const listAddresses = await getAllRecordsAddresses(section)
      setMemoryAddress((prev) => ({
        ...prev,
        [section]: listAddresses,
      }))
      setBtnsAddress((prev) => ({
        ...prev,
        [section]: { ...prev[section], clip: !!listAddresses.length },
      }))
    }

    const processSections = async () => {
      for (const section of ['sender', 'recipient'] as AddressRole[]) {
        checkField(section)
        await getMemory(section)
      }
    }

    processSections()
  }, [value])

  useEffect(() => {
    if (infoMiniAddressClose) {
      const fullToAddress = Object.values(value[infoMiniAddressClose]).every(
        (val) => val !== ''
      )
      if (fullToAddress) {
        setBtnsAddress((prev) => ({
          ...prev,
          [infoMiniAddressClose]: { ...prev[infoMiniAddressClose], save: true },
        }))
      }
    }
    dispatch(updateButtonsState({ miniAddressClose: null }))
  }, [infoMiniAddressClose])

  const changeParityInputsAddress = (section: AddressRole): boolean => {
    const memory = memoryAddress[section]
    const current = value[section]
    if (!memory) return true
    return !memory.some((entry) =>
      Object.entries(entry.address).every(
        ([key, value]) => value === current[key as keyof Address]
      )
    )
  }

  const clearSectionAddress = (section: AddressRole) => {
    setValue((prev) => ({
      ...prev,
      [section]: Object.keys(prev[section]).reduce(
        (acc, key) => {
          acc[key] = ''
          return acc
        },
        {} as Record<string, string>
      ),
    }))
  }

  const handleClickClip = (section: AddressRole) => {
    if (layoutChoiceClip === section) {
      dispatch(setChoiceClip(null))
    } else {
      dispatch(setChoiceClip(section))
    }
  }

  const handleClickBtn = async (
    evt: React.MouseEvent<HTMLButtonElement>,
    section: AddressRole
  ) => {
    evt.preventDefault()

    const parentBtn = searchParentBtnNav(evt.target as HTMLElement)
    if (!parentBtn) return

    const tooltip = parentBtn.dataset.tooltip

    if (tooltip === 'clip' && btnsAddress[section].clip === true) {
      handleClickClip(section)
    }

    if (tooltip === 'save' && btnsAddress[section].save) {
      const personalId = uuidv4().split('-')[0]

      const cleanupValue = (text: string) =>
        text.split(' ').filter(Boolean).join(' ')

      setValue((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          name: cleanupValue(prev[section].name),
          country: cleanupValue(prev[section].country),
          city: cleanupValue(prev[section].city),
        },
      }))

      await addUniqueRecordAddress(section, value[section], personalId)
      setBtnsAddress((prev) => ({
        ...prev,
        [section]: { ...prev[section], save: false },
      }))
      dispatch(updateButtonsState({ envelopeSave: section }))
      dispatch(setChoiceClip(section))
      dispatch(setSavedCardId(personalId))
    }

    if (tooltip === 'delete') {
      clearSectionAddress(section)
    }
  }

  const handleMouseEnter = (evt: MouseEvent<HTMLElement>) => {
    handleMouseEnterBtn(evt, btnsAddress)
  }

  const handleMouseLeave = (evt: MouseEvent<HTMLElement>) => {
    handleMouseLeaveBtn(evt, btnsAddress)
  }

  useEffect(() => {
    if (btnsAddress && btnIconRefs.current) {
      changeIconStyles(btnsAddress, btnIconRefs.current)
    }
  }, [btnsAddress])

  useEffect(() => {
    if (cardPuzzleRef?.current) {
      setHeightLogo(cardPuzzleRef.current.clientHeight / 14)
    }
  }, [cardPuzzleRef])

  useEffect(() => {
    dispatch(addEnvelope(value))
  }, [value])

  return (
    <div className="envelope">
      <div
        className="nav-container nav-container-envelope"
        style={{
          borderColor: layoutActiveEnvelope
            ? 'rgb(255, 255, 255)'
            : 'rgb(220, 220, 220)',
          transition: 'border-color 0.3s ease 0.3s',
        }}
      >
        <Toolbar />
      </div>

      <div className="envelope-logo-container">
        <span
          className="envelope-logo"
          ref={envelopeLogoRef}
          style={{ height: heightLogo ?? 0 }}
        ></span>
      </div>

      {ADDRESS_ROLES.map((role) => (
        <div
          key={role}
          className={`envelope-${role === 'sender' ? 'sender' : 'recipient'}`}
        >
          <EnvelopeAddress
            values={value}
            role={role}
            lang={lang}
            handleValue={handleValue}
            handleMovingBetweenInputs={handleMovingBetweenInputs}
            setInputRef={setInputRef}
            setBtnIconRef={setBtnIconRef}
            setAddressFieldsetRef={setAddressFieldsetRef}
            setAddressLegendRef={setAddressLegendRef}
            handleClickBtn={handleClickBtn}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
          />
        </div>
      ))}

      <Mark />
    </div>
  )
}
