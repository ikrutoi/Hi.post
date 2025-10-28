import React, { useEffect } from 'react'
import clsx from 'clsx'
import { ENVELOPE_ROLES } from '@shared/config/constants'
import { Mark } from '@envelope/view/presentation'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { getSafeLang } from '@i18n/helpers'
import { i18n } from '@i18n/i18n'
import { EnvelopeAddress } from '../addressForm/presentation'
import { useLayoutNavFacade } from '@layoutNav/application/facades'
import { useEnvelopeFacade } from '../application/facades'
import styles from './Envelope.module.scss'

type EnvelopeProps = {
  cardPuzzleRef: React.RefObject<HTMLDivElement | null>
}

export const Envelope: React.FC<EnvelopeProps> = ({ cardPuzzleRef }) => {
  const lang = getSafeLang(i18n.language)

  // const t = useEnvelopeTranslations(lang)

  const {
    state: {
      value,
      memoryAddress,
      btnsAddress,
      countAddress,
      stateMouseClip,
      heightLogo,
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
        setBtnsAddress,
        setCountAddress,
        setStateMouseClip,
        setHeightLogo,
      },
      controller: { handleValue, handleMovingBetweenInputs },
      interaction: { handleAddressAction },
    },
  } = useEnvelopeFacade()

  const { state } = useLayoutNavFacade()
  const { selectedCardMenuSection } = state

  useEffect(() => {
    if (!cardPuzzleRef.current) return
    const observer = new ResizeObserver(() => {
      const height = cardPuzzleRef.current?.offsetHeight ?? 0
      setHeightLogo(height * 0.15)
    })
    observer.observe(cardPuzzleRef.current)
    return () => observer.disconnect()
  }, [cardPuzzleRef, setHeightLogo])

  return (
    <div className={styles.envelope}>
      <div className={styles.envelope__toolbar}>{/* <Toolbar /> */}</div>

      <div className={styles.envelope__logoContainer}>
        <span
          className={styles.envelope__logo}
          ref={envelopeLogoRef}
          style={{ height: heightLogo ?? 0 }}
        />
      </div>

      {ENVELOPE_ROLES.map((role) => (
        <div
          key={role}
          className={clsx(
            styles.envelope__section,
            styles[`envelope__section--${role}`]
          )}
        >
          <EnvelopeAddress
            value={value}
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
            handleAddressAction={handleAddressAction}
            handleMouseEnter={(id) => setStateMouseClip(id)}
            handleMouseLeave={() => setStateMouseClip(null)}
            stateMouseClip={stateMouseClip}
          />
        </div>
      ))}

      <Mark />
    </div>
  )
}
