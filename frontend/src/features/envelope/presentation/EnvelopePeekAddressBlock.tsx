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
}

function linesFromAddress(address: Readonly<AddressFields> | null): string[] {
  if (address == null) return []
  const lines: string[] = []
  for (const key of ADDRESS_FIELD_ORDER) {
    const v = String(address[key] ?? '').trim()
    if (v !== '') lines.push(v)
  }
  return lines
}

export const EnvelopePeekAddressBlock: React.FC<
  EnvelopePeekAddressBlockProps
> = ({ role, className }) => {
  const { listRowInner } = useRightListArchiveMini()

  const senderLines = useMemo(() => {
    if (listRowInner == null) return []
    const { senderBadgeShow, sender, senderDisplayName } = listRowInner
    if (!senderBadgeShow) return []
    const fromFields = linesFromAddress(sender)
    if (fromFields.length > 0) return fromFields
    const name = (senderDisplayName ?? '').trim()
    return name ? [name] : []
  }, [listRowInner])

  const recipientLines = useMemo(() => {
    if (listRowInner == null) return []
    const { recipient, recipientCount } = listRowInner
    if (recipientCount <= 0) return []
    if (recipientCount > 1) {
      const single = linesFromAddress(recipient)
      if (single.length > 0) return single
      return [`${recipientCount} recipients`]
    }
    return linesFromAddress(recipient)
  }, [listRowInner])

  const lines = role === 'sender' ? senderLines : recipientLines

  return (
    <div
      className={clsx(
        styles.root,
        role === 'sender' ? styles.rootSender : styles.rootRecipient,
        className,
      )}
    >
      <div className={styles.lines}>
        {lines.map((line, i) => (
          <div key={i} className={styles.line}>
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}
