import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from './MiniEnvelope.module.scss'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { useEnvelopeFacade } from '@envelope/application/facades'
import { getEnvelopeCircleSteps } from './getEnvelopeCircleSteps'
import { useSenderFacade } from '@/features/envelope/sender/application/facades'

export const MiniEnvelope: React.FC = () => {
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('envelope')
  const { appliedRecipientAddress, recipient } = useEnvelopeFacade()
  const { state: senderState, isEnabled } = useSenderFacade()
  const count = recipient.applied.length
  const hasSenderApplied = isEnabled && senderState.applied.length > 0
  const showMini = count > 0 || hasSenderApplied
  const isSingle = count === 1
  const { steps, isMany } = getEnvelopeCircleSteps(count)
  const stepsToRender = isSingle ? getEnvelopeCircleSteps(2).steps : steps

  const nameWrapperRef = useRef<HTMLDivElement | null>(null)
  const nameInnerRef = useRef<HTMLSpanElement | null>(null)
  const [hasNameOverflow, setHasNameOverflow] = useState(false)

  const countryWrapperRef = useRef<HTMLDivElement | null>(null)
  const countryInnerRef = useRef<HTMLSpanElement | null>(null)
  const [hasCountryOverflow, setHasCountryOverflow] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (!isSingle) {
        setHasNameOverflow(false)
        setHasCountryOverflow(false)
        return
      }

      if (nameWrapperRef.current && nameInnerRef.current) {
        const wrapperWidth = nameWrapperRef.current.clientWidth
        const innerWidth = nameInnerRef.current.scrollWidth

        setHasNameOverflow(innerWidth > wrapperWidth + 1)
      } else {
        setHasNameOverflow(false)
      }

      if (countryWrapperRef.current && countryInnerRef.current) {
        const wrapperWidth = countryWrapperRef.current.clientWidth
        const innerWidth = countryInnerRef.current.scrollWidth

        setHasCountryOverflow(innerWidth > wrapperWidth + 1)
      } else {
        setHasCountryOverflow(false)
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)

    return () => {
      window.removeEventListener('resize', checkOverflow)
    }
  }, [isSingle, appliedRecipientAddress.name, appliedRecipientAddress.country])

  if (!showMini) {
    return null
  }

  return (
    <div
      className={clsx(
        styles.miniEnvelope,
        styles.visible,
        isHovered && styles.hovered,
        isSingle && styles.miniEnvelopeSingle,
        isMany && styles.miniEnvelopeMany,
      )}
      onMouseEnter={() => setHovered('envelope')}
      onMouseLeave={() => setHovered(null)}
    >
      {stepsToRender.length > 0 && (
        <div
          key={isSingle ? 'single' : 'multi'}
          className={clsx(
            styles.miniEnvelopeCircles,
            isSingle && styles.miniEnvelopeSingleCircles,
          )}
          aria-hidden
        >
          {stepsToRender.map((step, i) => (
            <span
              key={i}
              className={styles.miniEnvelopeCircle}
              style={{
                width: `${step.sizePercent}%`,
                maxHeight: `${step.sizePercent}%`,
                aspectRatio: 1,
                ...(isSingle ? {} : { opacity: step.opacity }),
              }}
            />
          ))}
        </div>
      )}
      {/* <div className={styles.miniEnvelopeLogo} /> */}
      {count > 0 &&
        (isSingle ? (
          <div className={styles.miniEnvelopeSingleContent}>
            <div
              ref={nameWrapperRef}
              className={clsx(
                styles.miniEnvelopeAddress,
                styles.miniEnvelopeName,
                hasNameOverflow && styles.miniEnvelopeNameOverflow,
              )}
            >
              <span ref={nameInnerRef} className={styles.miniEnvelopeNameInner}>
                {appliedRecipientAddress.name}
              </span>
            </div>
            <div
              ref={countryWrapperRef}
              className={clsx(
                styles.miniEnvelopeAddress,
                styles.miniEnvelopeCountry,
                hasCountryOverflow && styles.miniEnvelopeCountryOverflow,
              )}
            >
              <span
                ref={countryInnerRef}
                className={styles.miniEnvelopeCountryInner}
              >
                {appliedRecipientAddress.country}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.miniEnvelopeCount}>
            <span>{recipient.applied.length}</span>
          </div>
        ))}
      {hasSenderApplied && (
        <>
          <div className={styles.miniEnvelopeSender}></div>
          <span className={styles.miniEnvelopeSenderName}>
            <span className={styles.miniEnvelopeSenderNameOverflow}>
              <span className={styles.miniEnvelopeSenderNameInner}>
                {senderState.appliedData?.name}
              </span>
            </span>
          </span>
        </>
      )}
    </div>
  )
}
