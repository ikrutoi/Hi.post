import React from 'react'
import './Envelope.scss'

import { Mark, Toolbar } from '@envelope/view/presentation'
import { EnvelopeAddress } from '../addressForm/presentation'

import { useEnvelopeState } from '../application/state'
import {
  useEnvelopeController,
  useEnvelopeTranslations,
  useMiniAddressEffect,
  useEnvelopeSyncController,
} from '@envelope/application/controllers'
import {
  useToolbarInteraction,
  useLogoHeight,
} from '@envelope/view/application'
import { useAddressBookController } from '@envelope/addressBook/application/controllers'

import { ADDRESS_ROLES } from '@envelope/domain'
import { useCurrentLang } from '@shared/localizationLegacy/useCurrentLang'
import { addEnvelope } from '@store/slices/cardEditSlice'

type EnvelopeProps = {
  cardPuzzleRef: React.RefObject<HTMLDivElement>
}

export const Envelope: React.FC<EnvelopeProps> = ({ cardPuzzleRef }) => {
  const lang = useCurrentLang()

  const {
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
  } = useEnvelopeState()

  const t = useEnvelopeTranslations(lang)

  // useMiniAddressEffect({ value, setBtnsAddress })
  useLogoHeight({ cardPuzzleRef, setHeightLogo })

  const { handleValue, handleMovingBetweenInputs } = useEnvelopeController({
    inputRefs,
    setValue,
  })

  const { handleClickBtn, handleClickClip } = useAddressBookController({
    value,
    setValue,
    memoryAddress,
    setMemoryAddress,
    btnsAddress,
    setBtnsAddress,
    countAddress,
    setCountAddress,
  })

  const { handleMouseEnter, handleMouseLeave } = useToolbarInteraction({
    btnsAddress,
    btnIconRefs,
  })

  useEnvelopeSyncController(value)

  return (
    <div className="envelope">
      <div className="envelope__toolbar">
        <Toolbar />
      </div>

      <div className="envelope__logo-container">
        <span
          className="envelope__logo"
          ref={envelopeLogoRef}
          style={{ height: heightLogo ?? 0 }}
        />
      </div>

      {ADDRESS_ROLES.map((role) => (
        <div
          key={role}
          className={`envelope__section envelope__section--${role}`}
        >
          <EnvelopeAddress
            values={value}
            role={role}
            lang={lang}
            handleValue={handleValue}
            handleMovingBetweenInputs={handleMovingBetweenInputs}
            setInputRef={(id) => (el) => (inputRefs.current[id] = el!)}
            setBtnIconRef={(id) => (el) => (btnIconRefs.current[id] = el!)}
            setAddressFieldsetRef={(id) => (el) =>
              (addressFieldsetRefs.current[id] = el!)
            }
            setAddressLegendRef={(id) => (el) =>
              (addressLegendRefs.current[id] = el!)
            }
            handleClickBtn={handleClickBtn}
            handleClickClip={handleClickClip}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            stateMouseClip={stateMouseClip}
          />
        </div>
      ))}

      <Mark />
    </div>
  )
}
