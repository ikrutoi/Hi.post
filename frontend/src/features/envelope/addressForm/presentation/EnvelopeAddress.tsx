import React, { use, useEffect } from 'react'
import clsx from 'clsx'
import { Label } from './Label/Label'
import { LabelGroup } from './LabelGroup/LabelGroup'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { useEnvelopeAddress } from '../application/hooks'
import { useAddressFacade } from '../application/facades'
import { useCardEditorFacade } from '@entities/card/application/facades'
import {} from '@entities/card/application/facades'
import styles from './EnvelopeAddress.module.scss'
import type { EnvelopeAddressProps } from '../domain/types'
import { cardEditorReducer } from '@/entities/card/infrastructure/state'

export const EnvelopeAddress: React.FC<EnvelopeAddressProps> = ({
  role,
  roleLabel,
  lang,
  // setInputRef,
  // setBtnIconRef,
  // setAddressFieldsetRef,
  // setAddressLegendRef,
  // onValueChange,
  // onInputNavigation,
  // onAddressAction,
  // onMouseEnter,
  // onMouseLeave,
}) => {
  const { labelLayout, count, buttons } = useEnvelopeAddress(role, lang)

  const { state: stateAddress, actions: actionsAddress } =
    useAddressFacade(role)
  const { address: value, isComplete } = stateAddress
  const { onValueChange } = actionsAddress

  const { actions: actionsCardEditor } = useCardEditorFacade()
  const { setSectionComplete } = actionsCardEditor

  return (
    <form
      className={clsx(styles.addressForm, styles[`addressForm${roleLabel}`])}
    >
      <div
        className={clsx(
          styles.addressFormToolbar,
          styles[`addressFormToolbar${roleLabel}`]
        )}
      >
        <Toolbar section={role} />
      </div>

      <fieldset
        className={styles.addressFieldset}
        // ref={setAddressFieldsetRef(`${role}-fieldset`)}
      >
        <legend
          className={styles.addressLegend}
          // ref={setAddressLegendRef(`${role}-legend`)}
        >
          {roleLabel} value
        </legend>

        {labelLayout.map((item, i) =>
          Array.isArray(item) ? (
            <LabelGroup
              key={`group-${i}`}
              group={item}
              roleLabel={roleLabel}
              role={role}
              value={value}
              onValueChange={onValueChange}
              // onInputNavigation={onInputNavigation}
              // setInputRef={setInputRef}
            />
          ) : (
            <Label
              key={`${item}-${i}`}
              role={role}
              roleLabel={roleLabel}
              label={item.label}
              field={item.key}
              value={value[item.key]}
              index={i}
              onValueChange={onValueChange}
              // onInputNavigation={onInputNavigation}
              // setInputRef={setInputRef}
            />
          )
        )}
      </fieldset>
    </form>
  )
}
