import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { AddressFields } from '@shared/config/constants'
import { ADDRESS_FIELD_ORDER } from '@shared/config/constants'
import { useAppSelector } from '@app/hooks'
import {
  selectAppliedRecipientDisplayAddress,
  selectRecipientApplied,
  selectRecipientState,
  selectRecipientEntriesState,
} from '@envelope/recipient/infrastructure/selectors'
import {
  selectAppliedSenderDisplayAddress,
  selectSenderApplied,
} from '@envelope/sender/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxAppliedSenderDisplayAddress,
  selectArchiveSandboxAppliedRecipientDisplayAddress,
  selectArchiveSandboxSenderApplied,
  selectArchiveSandboxRecipientApplied,
  selectArchiveSandboxSenderAppliedLocked,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import { buildRecipientPreviewLines } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import { expandAndShuffleForBg } from '@features/cardPie/domain/pieScatteredBackground'
import { DATE_PEEK_SCATTER_SLOTS } from '@date/presentation/DatePeekMultiBackground'
import styles from './EnvelopePeekAddressBlock.module.scss'

export type EnvelopePeekAddressBlockProps = {
  role: 'sender' | 'recipient'
  /** Стыковка с сеткой конверта (`flex: 1` вместо `form`). */
  className?: string
  /** Mobile: уплотнить межстрочный интервал адреса в peek. */
  compact?: boolean
  /**
   * Apply-peek: session (left) or archive sandbox (right).
   * Archive list-row peek: leave false — данные из listRowInner.
   */
  fromSessionApplied?: boolean
  /**
   * Dual-side simplified: if session applied lines are empty, show this draft.
   */
  addressFallback?: Readonly<AddressFields> | null
  /**
   * Apply-peek with 2+ Recipients (same as CardPie name-scatter + count).
   * View-like 1px shell; numeral matches date selected-days count.
   */
  appliedCount?: number | null
}

type PeekAddressLine = { text: string; isName: boolean }

/** Matches CardPie envelope scatter `fontSize: 300` on the 2560 pattern (~11.7cqw). */
const ENVELOPE_NAME_FONT_SIZE_CQW = (300 / 2560) * 100

const ENVELOPE_NAME_SCATTER_COUNT = 24
/** Recipients form (and 1.6× scatter canvas) is twice as wide as tall. */
const ENVELOPE_NAME_SCATTER_ASPECT = 2
const ENVELOPE_NAME_SCATTER_PAD = -4
/** Visual min distance in units of scatter height (Poisson). */
const ENVELOPE_NAME_SCATTER_MIN_DIST = 0.22

function hashSeed(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t = (Math.imul(t, 1103515245) + 12345) >>> 0
    return (t >>> 0) / 4294967296
  }
}

function buildEnvelopeNameScatterSlots(): {
  left: number
  top: number
  fontSizeCqw: number
  rotate: number
}[] {
  const rand = mulberry32(hashSeed('envelope-name-scatter-layout-v1'))
  const pad = ENVELOPE_NAME_SCATTER_PAD
  const span = 100 - 2 * pad
  const slots: {
    left: number
    top: number
    fontSizeCqw: number
    rotate: number
  }[] = []

  let attempts = 0
  const maxAttempts = ENVELOPE_NAME_SCATTER_COUNT * 120

  while (
    slots.length < ENVELOPE_NAME_SCATTER_COUNT &&
    attempts < maxAttempts
  ) {
    attempts += 1
    const left = pad + rand() * span
    const top = pad + rand() * span
    const tooClose = slots.some((s) => {
      const dx = ((s.left - left) / 100) * ENVELOPE_NAME_SCATTER_ASPECT
      const dy = (s.top - top) / 100
      return Math.hypot(dx, dy) < ENVELOPE_NAME_SCATTER_MIN_DIST
    })
    if (tooClose) continue

    slots.push({
      left,
      top,
      fontSizeCqw: ENVELOPE_NAME_FONT_SIZE_CQW,
      rotate: DATE_PEEK_SCATTER_SLOTS[slots.length]?.rotate ?? 0,
    })
  }

  while (slots.length < ENVELOPE_NAME_SCATTER_COUNT) {
    slots.push({
      left: pad + rand() * span,
      top: pad + rand() * span,
      fontSizeCqw: ENVELOPE_NAME_FONT_SIZE_CQW,
      rotate: DATE_PEEK_SCATTER_SLOTS[slots.length]?.rotate ?? 0,
    })
  }

  return slots
}

const ENVELOPE_COUNT_NAME_SLOTS = buildEnvelopeNameScatterSlots()

function addressLinesForPeek(
  address: Readonly<AddressFields> | null | undefined,
): PeekAddressLine[] {
  if (address == null) return []
  const lines: PeekAddressLine[] = []
  for (const key of ADDRESS_FIELD_ORDER) {
    const v = String(address[key] ?? '').trim()
    if (v !== '') lines.push({ text: v, isName: key === 'name' })
  }
  return lines
}

export const EnvelopePeekAddressBlock: React.FC<
  EnvelopePeekAddressBlockProps
> = ({
  role,
  className,
  compact = false,
  fromSessionApplied = false,
  addressFallback = null,
  appliedCount = null,
}) => {
  const { listRowInner } = useRightListArchiveMini()
  const recipientState = useAppSelector(selectRecipientState)
  const envelopeRecipients = useAppSelector(selectRecipientsList)
  const recipientEntries = useAppSelector(selectRecipientEntriesState)
  const recipientPreviewLines = useMemo(
    () =>
      buildRecipientPreviewLines(recipientState, {
        envelopeRecipients,
        recipientEntries,
      }),
    [envelopeRecipients, recipientEntries, recipientState],
  )
  const scatteredNames = useMemo(() => {
    const seed = `env-${recipientPreviewLines.join('\u0000')}`
    return expandAndShuffleForBg(
      recipientPreviewLines,
      ENVELOPE_COUNT_NAME_SLOTS.length,
      seed,
    )
  }, [recipientPreviewLines])
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const appliedSender = useAppSelector(selectAppliedSenderDisplayAddress)
  const senderAppliedIds = useAppSelector(selectSenderApplied)
  const appliedRecipient = useAppSelector(selectAppliedRecipientDisplayAddress)
  const recipientAppliedIds = useAppSelector(selectRecipientApplied)
  const sandboxAppliedSender = useAppSelector(
    selectArchiveSandboxAppliedSenderDisplayAddress,
  )
  const sandboxSenderAppliedIds = useAppSelector(
    selectArchiveSandboxSenderApplied,
  )
  const sandboxSenderLocked = useAppSelector(
    selectArchiveSandboxSenderAppliedLocked,
  )
  const sandboxAppliedRecipient = useAppSelector(
    selectArchiveSandboxAppliedRecipientDisplayAddress,
  )
  const sandboxRecipientAppliedIds = useAppSelector(
    selectArchiveSandboxRecipientApplied,
  )

  const senderLinesFromArchive = useMemo(() => {
    if (listRowInner == null) return []
    const { senderBadgeShow, sender, senderDisplayName } = listRowInner
    if (!senderBadgeShow) return []
    const fromFields = addressLinesForPeek(sender)
    if (fromFields.length > 0) return fromFields
    const name = (senderDisplayName ?? '').trim()
    return name ? [{ text: name, isName: true }] : []
  }, [listRowInner])

  const senderLinesFromSession = useMemo(() => {
    if (sandboxActive) {
      if (!sandboxSenderLocked) return []
      return addressLinesForPeek(sandboxAppliedSender)
    }
    if (senderAppliedIds.length <= 0) return []
    return addressLinesForPeek(appliedSender)
  }, [
    sandboxActive,
    sandboxSenderLocked,
    sandboxAppliedSender,
    appliedSender,
    senderAppliedIds.length,
  ])

  const recipientLinesFromArchive = useMemo(() => {
    if (listRowInner == null) return []
    const { recipient, recipientCount } = listRowInner
    if (recipientCount <= 0) return []
    if (recipientCount > 1) {
      const single = addressLinesForPeek(recipient)
      if (single.length > 0) return single
      return [{ text: `${recipientCount} recipients`, isName: false }]
    }
    return addressLinesForPeek(recipient)
  }, [listRowInner])

  const recipientLinesFromSession = useMemo(() => {
    if (sandboxActive) {
      const count = sandboxRecipientAppliedIds.length
      if (count <= 0) return []
      if (count > 1) {
        const single = addressLinesForPeek(sandboxAppliedRecipient)
        if (single.length > 0) return single
        return [{ text: `${count} recipients`, isName: false }]
      }
      return addressLinesForPeek(sandboxAppliedRecipient)
    }
    const count = recipientAppliedIds.length
    if (count <= 0) return []
    if (count > 1) {
      const single = addressLinesForPeek(appliedRecipient)
      if (single.length > 0) return single
      return [{ text: `${count} recipients`, isName: false }]
    }
    return addressLinesForPeek(appliedRecipient)
  }, [
    sandboxActive,
    sandboxRecipientAppliedIds.length,
    sandboxAppliedRecipient,
    appliedRecipient,
    recipientAppliedIds.length,
  ])

  const linesFromRole =
    role === 'sender'
      ? fromSessionApplied
        ? senderLinesFromSession
        : senderLinesFromArchive
      : fromSessionApplied
        ? recipientLinesFromSession
        : recipientLinesFromArchive
  const fallbackLines = addressLinesForPeek(addressFallback)
  const lines =
    linesFromRole.length > 0
      ? linesFromRole
      : fromSessionApplied
        ? fallbackLines
        : linesFromRole

  if (role === 'recipient' && appliedCount != null && appliedCount > 1) {
    return (
      <div
        className={clsx(
          styles.root,
          styles.rootRecipient,
          styles.rootAppliedCount,
          compact && styles.rootCompact,
          className,
        )}
      >
        <div className={styles.countShell} data-envelope-address-fieldset>
          <div className={styles.nameScatter} aria-hidden>
            {ENVELOPE_COUNT_NAME_SLOTS.map((slot, i) => {
              const raw = scatteredNames[i]
              if (raw == null || raw === '') return null
              return (
                <span
                  key={`${slot.left}-${slot.top}-${i}`}
                  className={styles.nameScatterItem}
                  style={
                    {
                      left: `${slot.left}%`,
                      top: `${slot.top}%`,
                      fontSize: `${slot.fontSizeCqw}cqw`,
                      '--peek-scatter-rotate': `${slot.rotate}deg`,
                    } as React.CSSProperties
                  }
                >
                  {raw}
                </span>
              )
            })}
          </div>
          <span className={styles.count}>{appliedCount}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        styles.root,
        role === 'sender' ? styles.rootSender : styles.rootRecipient,
        compact && styles.rootCompact,
        className,
      )}
    >
      <div className={styles.lines}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={clsx(styles.line, line.isName && styles.lineName)}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  )
}
