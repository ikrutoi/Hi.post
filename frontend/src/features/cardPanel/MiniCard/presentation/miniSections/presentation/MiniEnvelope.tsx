import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from './MiniEnvelope.module.scss'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { useEnvelopeFacade } from '@envelope/application/facades'
import { getEnvelopeRecipientCircleSteps } from './concentricCircleSteps'
import { useSenderFacade } from '@/features/envelope/sender/application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'

export const MiniEnvelope: React.FC = () => {
  const { centerStripListMirrorEnabled, mirrorInner } = useRightListArchiveMini()
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('envelope')
  const { appliedRecipientAddress, recipient } = useEnvelopeFacade()
  const { state: senderState, isEnabled } = useSenderFacade()

  const listInner =
    centerStripListMirrorEnabled && mirrorInner != null ? mirrorInner : null

  const count =
    listInner != null ? listInner.recipientCount : recipient.applied.length
  const hasSenderAppliedSession =
    isEnabled && senderState.applied.length > 0
  const senderBadgeFromList = listInner?.senderBadgeShow === true
  const showMini =
    listInner != null
      ? count > 0 || senderBadgeFromList
      : count > 0 || hasSenderAppliedSession
  const isSingle = count === 1
  const { steps, isMany } = getEnvelopeRecipientCircleSteps(count)
  const stepsToRender = isSingle
    ? getEnvelopeRecipientCircleSteps(2).steps
    : steps

  const nameDisplay =
    listInner?.recipient?.name ?? appliedRecipientAddress.name
  const countryDisplay =
    listInner?.recipient?.country ?? appliedRecipientAddress.country

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
  }, [isSingle, nameDisplay, countryDisplay])

  if (centerStripListMirrorEnabled && mirrorInner == null) {
    return null
  }

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
                {nameDisplay}
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
                {countryDisplay}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.miniEnvelopeCount}>
            <span>{count}</span>
          </div>
        ))}
      {(listInner != null ? senderBadgeFromList : hasSenderAppliedSession) && (
        <>
          <div className={styles.miniEnvelopeSender}></div>
          <span className={styles.miniEnvelopeSenderName}>
            <span className={styles.miniEnvelopeSenderNameOverflow}>
              <span className={styles.miniEnvelopeSenderNameInner}>
                {listInner != null
                  ? (listInner.senderDisplayName ?? '')
                  : senderState.appliedData?.name}
              </span>
            </span>
          </span>
        </>
      )}
    </div>
  )
}
