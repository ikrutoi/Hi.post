import { takeLatest, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  setSource,
  setActiveTemplate,
  resetToSections,
} from '@cardPanel/infrastructure/state'
import type { CardPanelTemplate } from '@cardPanel/domain/types'
import type { RootState } from '@app/state'

function getTemplateForSection(section: string): CardPanelTemplate | null {
  if (section === 'sender') return 'envelopeSender'
  if (section === 'recipient') return 'envelopeRecipient'
  if (section === 'cardtext') return 'cardtext'
  return null
}

function* handleCardPanelToolbarAction(
  action: ReturnType<typeof toolbarAction>,
) {
  const { section, key } = action.payload

  const template = getTemplateForSection(section)
  if (template === null) return

  const isTextList = key === 'textList' && section === 'cardtext'
  if (!isTextList) return

  const cardPanel: RootState['cardPanel'] = yield select(
    (s: RootState) => s.cardPanel,
  )
  const isAlreadyOpen =
    cardPanel.source === 'templates' && cardPanel.activeTemplate === template

  if (isAlreadyOpen) {
    yield put(resetToSections())
    return
  }

  yield put(setSource('templates'))
  yield put(setActiveTemplate(template))
}

export function* cardPanelToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleCardPanelToolbarAction)
}
