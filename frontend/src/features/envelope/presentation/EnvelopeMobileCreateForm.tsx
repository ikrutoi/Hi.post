import React from 'react'
import { AddressFormView } from '../addressForm/presentation/AddressFormView'
import { useSenderFacade } from '../sender/application/facades'
import { useRecipientFacade } from '../recipient/application/facades'
import type { Lang } from '@i18n/types'
import styles from './Envelope.module.scss'

type Props = {
  role: 'sender' | 'recipient'
  lang: Lang
}

export const EnvelopeMobileCreateForm: React.FC<Props> = ({ role, lang }) => {
  const senderFacade = useSenderFacade()
  const recipientFacade = useRecipientFacade()
  const facade = role === 'sender' ? senderFacade : recipientFacade
  const roleLabel = role === 'sender' ? 'Sender' : 'Recipients'

  return (
    <div className={styles.envelopeMobileCreateSurface}>
      <AddressFormView
        role={role}
        roleLabel={roleLabel}
        address={facade.formDraft}
        onFieldChange={facade.update}
        lang={lang}
        mobileFullscreen
      />
    </div>
  )
}
