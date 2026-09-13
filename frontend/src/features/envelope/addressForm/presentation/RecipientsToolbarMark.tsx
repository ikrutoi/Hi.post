import React, { useCallback } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useRecipientFacade } from '@envelope/recipient/application/facades'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipient,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import {
  setArchiveRecipientView,
  setArchiveRecipientViewId,
} from '@cardPanel/infrastructure/state'
import {
  closeAddressEditSession,
  setAddressFormView,
  clearAddressCreateEditContext,
} from '@envelope/infrastructure/state'
import { selectRecipientViewEditMode } from '@envelope/infrastructure/selectors'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import {
  setRecipientView,
  setRecipientViewId,
} from '@envelope/recipient/infrastructure/state'
import { IconUsers } from '@shared/ui/icons'
import { toolbarAction } from '@toolbar/application/helpers'
import styles from './RecipientsToolbarMark.module.scss'

/**
 * Lower factory toolbar: recipient count + Users, left of the action keys.
 */
export const RecipientsToolbarMark: React.FC = () => {
  const dispatch = useAppDispatch()
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)
  const sessionRecipientView = useAppSelector(selectRecipientView)
  const recipientView = sandboxActive
    ? sandboxRecipient.currentView
    : sessionRecipientView
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const count = useRecipientFacade().recipientsDisplayList.length

  const handleCountClick = useCallback(() => {
    if (count <= 1) return
    if (recipientView === 'recipientsView') return

    if (sandboxActive) {
      dispatch(setArchiveRecipientViewId(null))
      dispatch(setArchiveRecipientView('recipientsView'))
      return
    }

    if (recipientView === 'recipientView') {
      dispatch(toolbarAction({ section: 'recipientView', key: 'close' }))
      return
    }

    if (recipientViewEditMode) {
      dispatch(
        closeAddressEditSession({ role: 'recipient', keepRecipientView: true }),
      )
    }
    dispatch(clearAddressCreateEditContext())
    dispatch(setAddressFormView({ show: false, role: null }))
    dispatch(setRecipientViewId(null))
    dispatch(setRecipientView('recipientsView'))
  }, [count, dispatch, recipientView, recipientViewEditMode, sandboxActive])

  return (
    <div className={styles.mark} data-envelope-recipients-toolbar-mark>
      {count > 1 ? (
        <button
          type="button"
          className={clsx(
            styles.countBadge,
            recipientView !== 'recipientsView' && styles.countBadgeInteractive,
          )}
          onClick={handleCountClick}
          disabled={recipientView === 'recipientsView'}
          aria-label="Open selected recipients list"
        >
          {count}
        </button>
      ) : null}
      <IconUsers className={styles.icon} aria-hidden />
    </div>
  )
}
