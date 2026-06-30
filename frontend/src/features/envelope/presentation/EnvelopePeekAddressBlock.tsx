import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { AddressFields } from '@shared/config/constants'
import { ADDRESS_FIELD_ORDER } from '@shared/config/constants'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import styles from './EnvelopePeekAddressBlock.module.scss'

export type EnvelopePeekAddressBlockProps = {
  role: 'sender' | 'recipient'
  /** Стыковка с сеткой конверта (`flex: 1` вместо `form`). */
  className?: string
  /** Mobile: уплотнить межстрочный интервал адреса в peek. */
  compact?: boolean
}

type PeekAddressLine = { text: string; isName: boolean }

function addressLinesForPeek(
  address: Readonly<AddressFields> | null,
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
> = ({ role, className, compact = false }) => {
  const { listRowInner } = useRightListArchiveMini()

  const senderLines = useMemo(() => {
    if (listRowInner == null) return []
    const { senderBadgeShow, sender, senderDisplayName } = listRowInner
    if (!senderBadgeShow) return []
    const fromFields = addressLinesForPeek(sender)
    if (fromFields.length > 0) return fromFields
    const name = (senderDisplayName ?? '').trim()
    return name ? [{ text: name, isName: true }] : []
  }, [listRowInner])

  const recipientLines = useMemo(() => {
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

  const lines = role === 'sender' ? senderLines : recipientLines

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
