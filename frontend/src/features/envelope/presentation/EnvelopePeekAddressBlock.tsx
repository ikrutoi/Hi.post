import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { AddressFields } from '@shared/config/constants'
import { ADDRESS_FIELD_ORDER } from '@shared/config/constants'
import { useAppSelector } from '@app/hooks'
import {
  selectAppliedRecipientDisplayAddress,
  selectRecipientApplied,
} from '@envelope/recipient/infrastructure/selectors'
import {
  selectAppliedSenderDisplayAddress,
  selectSenderApplied,
} from '@envelope/sender/infrastructure/selectors'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import styles from './EnvelopePeekAddressBlock.module.scss'

export type EnvelopePeekAddressBlockProps = {
  role: 'sender' | 'recipient'
  /** Стыковка с сеткой конверта (`flex: 1` вместо `form`). */
  className?: string
  /** Mobile: уплотнить межстрочный интервал адреса в peek. */
  compact?: boolean
  /**
   * Assembly apply-peek: брать адрес из session (applied), а не из archive listRow.
   * Для archive peek оставить false — данные из listRowInner.
   */
  fromSessionApplied?: boolean
}

type PeekAddressLine = { text: string; isName: boolean }

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
}) => {
  const { listRowInner } = useRightListArchiveMini()
  const appliedSender = useAppSelector(selectAppliedSenderDisplayAddress)
  const senderAppliedIds = useAppSelector(selectSenderApplied)
  const appliedRecipient = useAppSelector(selectAppliedRecipientDisplayAddress)
  const recipientAppliedIds = useAppSelector(selectRecipientApplied)

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
    if (senderAppliedIds.length <= 0) return []
    return addressLinesForPeek(appliedSender)
  }, [appliedSender, senderAppliedIds.length])

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
    const count = recipientAppliedIds.length
    if (count <= 0) return []
    if (count > 1) {
      const single = addressLinesForPeek(appliedRecipient)
      if (single.length > 0) return single
      return [{ text: `${count} recipients`, isName: false }]
    }
    return addressLinesForPeek(appliedRecipient)
  }, [appliedRecipient, recipientAppliedIds.length])

  const lines =
    role === 'sender'
      ? fromSessionApplied
        ? senderLinesFromSession
        : senderLinesFromArchive
      : fromSessionApplied
        ? recipientLinesFromSession
        : recipientLinesFromArchive

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
