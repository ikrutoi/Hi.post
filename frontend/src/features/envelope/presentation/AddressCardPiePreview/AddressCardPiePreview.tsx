import React from 'react'
import clsx from 'clsx'
import { IconSectionMenuEnvelopeV2 } from '@shared/ui/icons'
import type { AddressCardPiePreviewModel } from '@envelope/application/hooks/useAddressCardPiePreview'
import styles from './AddressCardPiePreview.module.scss'

type Props = {
  preview: AddressCardPiePreviewModel | null
}

export const AddressCardPiePreview: React.FC<Props> = ({ preview }) => {
  if (preview == null) {
    return (
      <div className={styles.placeholder} aria-hidden>
        <IconSectionMenuEnvelopeV2 />
      </div>
    )
  }

  return (
    <div
      className={styles.preview}
      data-address-list-preview-role={preview.role}
      aria-label="Selected address template preview"
    >
      <div className={styles.lines}>
        {preview.lines.map((line) => (
          <div
            key={line.field}
            className={clsx(styles.line, line.isName && styles.lineName)}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  )
}
