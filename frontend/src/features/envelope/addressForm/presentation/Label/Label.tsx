import React, { forwardRef, useLayoutEffect, useRef } from 'react'
import clsx from 'clsx'
import { getToolbarIcon } from '@shared/utils/icons'
import { applyTitleCaseInput } from '@shared/utils/helpers'
import styles from './Label.module.scss'
import type { AddressFields } from '@shared/config/constants'

const TITLE_CASE_FIELDS = new Set<keyof AddressFields>([
  'name',
  'street',
  'city',
  'country',
])

type LabelProps = {
  role: string
  roleLabel: string
  label: string
  field: keyof AddressFields
  value: string
  onValueChange: (field: keyof AddressFields, value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const Label = forwardRef<HTMLInputElement, LabelProps>(
  ({ role, roleLabel, label, field, value, onValueChange, onKeyDown }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const pendingSelectionRef = useRef<{ start: number; end: number } | null>(
      null,
    )

    const setRefs = (el: HTMLInputElement | null) => {
      inputRef.current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) ref.current = el
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const input = e.currentTarget
      const raw = input.value
      const selectionStart = input.selectionStart ?? raw.length
      const selectionEnd = input.selectionEnd ?? raw.length
      const next =
        field === 'zip'
          ? raw.toUpperCase()
          : TITLE_CASE_FIELDS.has(field)
            ? applyTitleCaseInput(value, raw)
            : raw
      const delta = next.length - raw.length
      pendingSelectionRef.current = {
        start: Math.max(0, selectionStart + delta),
        end: Math.max(0, selectionEnd + delta),
      }
      onValueChange(field, next)
    }

    useLayoutEffect(() => {
      const pending = pendingSelectionRef.current
      if (pending == null) return
      pendingSelectionRef.current = null
      const input = inputRef.current
      if (!input || document.activeElement !== input) return
      const max = input.value.length
      try {
        input.setSelectionRange(
          Math.min(pending.start, max),
          Math.min(pending.end, max),
        )
      } catch {
        /* Edge may reject setSelectionRange on some input states */
      }
    }, [value])

    const handleClear = () => {
      onValueChange(field, '')
    }

    return (
      <label
        className={clsx(
          styles.label,
          styles[`label${roleLabel}`],
          styles[`labelField${field}`],
        )}
      >
        <span className={styles.labelText}>{label}</span>

        <div
          className={clsx(
            styles.inputWrapper,
            styles[`inputWrapper${roleLabel}`],
          )}
        >
          <input
            className={clsx(
              styles.labelInput,
              styles[`labelInput${roleLabel}`],
              field === 'zip' && styles.labelInputZip,
              field === 'city' && styles.labelInputCity,
            )}
            ref={setRefs}
            type="text"
            value={value}
            aria-label={label}
            autoCapitalize={
              field === 'zip'
                ? 'characters'
                : TITLE_CASE_FIELDS.has(field)
                  ? 'words'
                  : 'sentences'
            }
            autoCorrect="on"
            onChange={handleChange}
            onKeyDown={onKeyDown}
          />
          {value.trim() !== '' && (
            <button
              type="button"
              className={clsx(styles.clearButton)}
              onClick={handleClear}
            >
              {getToolbarIcon({ key: 'clearInput' })}
            </button>
          )}
        </div>
      </label>
    )
  },
)
