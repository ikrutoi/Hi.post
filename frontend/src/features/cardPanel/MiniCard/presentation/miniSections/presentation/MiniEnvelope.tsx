import React from 'react'
import clsx from 'clsx'
import styles from './MiniEnvelope.module.scss'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { getToolbarIcon } from '@/shared/utils/icons'
import { useEnvelopeFacade } from '@envelope/application/facades'
import { getEnvelopeCircleSteps } from './getEnvelopeCircleSteps'

export const MiniEnvelope: React.FC = () => {
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('envelope')
  const { addressRecipient, cancelEnvelopeSelection, recipient } =
    useEnvelopeFacade()
  const count = recipient.applied.length
  const isSingle = count === 1
  const { steps, isMany } = getEnvelopeCircleSteps(count)
  const stepsToRender = isSingle ? getEnvelopeCircleSteps(2).steps : steps

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
      {isSingle ? (
        <div className={styles.miniEnvelopeSingleContent}>
          <div
            className={clsx(
              styles.miniEnvelopeAddress,
              styles.miniEnvelopeName,
            )}
          >
            {addressRecipient.name}
          </div>
          <div
            className={clsx(
              styles.miniEnvelopeAddress,
              styles.miniEnvelopeCity,
            )}
          >
            {addressRecipient.country}
          </div>
        </div>
      ) : (
        <div className={styles.miniEnvelopeCount}>
          <span>{recipient.applied.length}</span>
          {/* <span className={styles.miniEnvelopeCountLabel}>recipients</span> */}
        </div>
      )}
      <button
        className={clsx(styles.previewButton, styles.previewButtonDelete)}
        aria-label="Cancel selection"
        onClick={(e) => {
          e.stopPropagation()
          cancelEnvelopeSelection()
        }}
      >
        {getToolbarIcon({ key: 'clearInput' })}
      </button>
    </div>
  )
}
