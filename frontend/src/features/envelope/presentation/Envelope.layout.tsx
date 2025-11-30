import React from 'react'
import clsx from 'clsx'
import { ENVELOPE_ROLE_LABELLED } from '@shared/config/constants'
import { Mark } from '@envelope/view/presentation'
import { getSafeLang } from '@i18n/helpers'
import { i18n } from '@i18n/i18n'
import { EnvelopeAddress } from '../addressForm/presentation'
import { useLayoutNavFacade } from '@layoutNav/application/facades'
import { useEnvelopeLayoutFacade } from '../application/facades'
import styles from './Envelope.module.scss'

type EnvelopeProps = {
  cardPuzzleRef: React.RefObject<HTMLDivElement | null>
}

export const Envelope: React.FC<EnvelopeProps> = ({ cardPuzzleRef }) => {
  const lang = getSafeLang(i18n.language)

  const {
    state: {
      memoryAddress,
      btnsAddress,
      countAddress,
      stateMouseClip,
      // heightLogo,
    },
    refs: {
      inputRefs,
      btnIconRefs,
      addressFieldsetRefs,
      addressLegendRefs,
      envelopeLogoRef,
    },
    actions: {
      local: {
        setValue,
        setMemoryAddress,
        setCountAddress,
        setStateMouseClip,
        // setHeightLogo,
      },
      controller: { handleValue, handleMovingBetweenInputs },
      interaction: { handleAddressAction },
    },
  } = useEnvelopeLayoutFacade()

  const { state } = useLayoutNavFacade()
  const { selectedCardMenuSection } = state

  return (
    <div className={styles.envelope}>
      <div className={styles.envelopeLogo} ref={envelopeLogoRef} />
      {ENVELOPE_ROLE_LABELLED.map(({ key: role, label }) => (
        <div
          key={role}
          className={clsx(
            styles.envelopeSection,
            styles[`envelopeSection${label}`]
          )}
        >
          <EnvelopeAddress
            role={role}
            roleLabel={label}
            lang={lang}
            setInputRef={(id) => (el) => (inputRefs.current[id] = el!)}
            // setBtnIconRef={(id) => (el) => (btnIconRefs.current[id] = el!)}
            setAddressFieldsetRef={(id) => (el) =>
              (addressFieldsetRefs.current[id] = el!)
            }
            setAddressLegendRef={(id) => (el) =>
              (addressLegendRefs.current[id] = el!)
            }
            // onValueChange={handleValue}
            onInputNavigation={handleMovingBetweenInputs}
            onAddressAction={handleAddressAction}
            onMouseEnter={(id) => setStateMouseClip(id)}
            onMouseLeave={() => setStateMouseClip(null)}
            // stateMouseClip={stateMouseClip}
          />
        </div>
      ))}

      <Mark />
    </div>
  )
}
