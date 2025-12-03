import React, { useRef } from 'react'
import clsx from 'clsx'
import { Label } from './Label/Label'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { Toggle } from '@shared/ui/Toggle/Toggle'
import { useEnvelopeAddress } from '../application/hooks'
import { useSenderFacade } from '../../sender/application/facades'
import { useRecipientFacade } from '../../recipient/application/facades'
import styles from './EnvelopeAddress.module.scss'
import type { EnvelopeAddressProps } from '../domain/types'

export const EnvelopeAddress: React.FC<EnvelopeAddressProps> = ({
  role,
  roleLabel,
  lang,
}) => {
  const { labelLayout } = useEnvelopeAddress(role, lang)

  const senderFacade = useSenderFacade()
  const recipientFacade = useRecipientFacade()

  const facade = role === 'sender' ? senderFacade : recipientFacade
  const { state, layout, actions } = facade
  const { address: value } = state
  const { update } = actions

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault()
      inputsRef.current[i + 1]?.focus()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      inputsRef.current[i - 1]?.focus()
    }
  }

  let fieldIndex = 0

  return (
    <form
      className={clsx(styles.addressForm, styles[`addressForm${roleLabel}`])}
    >
      {role === 'sender' && (
        <div className={styles.senderToggle}>
          <Toggle
            label="Specify the sender's address"
            checked={senderFacade.state.isEnabled}
            onChange={senderFacade.actions.toggle}
            size="default"
          />
        </div>
      )}

      {(role === 'recipient' || senderFacade.state.isEnabled) && (
        <>
          <div
            className={clsx(
              styles.addressFormToolbar,
              styles[`addressFormToolbar${roleLabel}`]
            )}
          >
            <Toolbar section={role} />
          </div>

          <fieldset className={styles.addressFieldset}>
            <legend className={styles.addressLegend}>{roleLabel} value</legend>

            {labelLayout.flatMap((item, i) => {
              if (Array.isArray(item)) {
                return (
                  <div
                    key={`group-${i}`}
                    className={clsx(
                      styles.labelGroup,
                      styles[`labelGroup${roleLabel}`]
                    )}
                  >
                    {item.map((subItem, j) => {
                      const currentIndex = fieldIndex++
                      return (
                        <Label
                          key={`${subItem.key}-${i}-${j}`}
                          ref={(el: HTMLInputElement | null) => {
                            if (el) inputsRef.current[currentIndex] = el
                          }}
                          role={role}
                          roleLabel={roleLabel}
                          label={subItem.label}
                          field={subItem.key}
                          value={value[subItem.key]}
                          onValueChange={(field, val) => update(field, val)}
                          onKeyDown={(e) => handleKeyDown(e, currentIndex)}
                        />
                      )
                    })}
                  </div>
                )
              } else {
                const currentIndex = fieldIndex++
                return (
                  <Label
                    key={`${item.key}-${i}`}
                    ref={(el: HTMLInputElement | null) => {
                      if (el) inputsRef.current[currentIndex] = el
                    }}
                    role={role}
                    roleLabel={roleLabel}
                    label={item.label}
                    field={item.key}
                    value={value[item.key]}
                    onValueChange={(field, val) => update(field, val)}
                    onKeyDown={(e) => handleKeyDown(e, currentIndex)}
                  />
                )
              }
            })}
          </fieldset>
        </>
      )}
    </form>
  )
}
