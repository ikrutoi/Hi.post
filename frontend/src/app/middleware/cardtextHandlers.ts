import { Editor, Transforms, Text as SlateText } from 'slate'
import { call, put, select } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  selectCardtextState,
  selectFontSizeStep,
} from '@cardtext/infrastructure/selectors'
import { setTextStyle } from '@cardtext/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  CARDTEXT_CONFIG,
  STEP_TO_PX,
  clampCardtextFontSizeStep,
} from '@cardtext/domain/types'

const CARDTEXT_FONT_TOOLBAR_SECTIONS = [
  'cardtext',
  'cardtextEditor',
  'cardtextCreate',
] as const

export function* changeFontSizeStep(
  editor: Editor,
  direction: 'more' | 'less',
) {
  const currentStep: number = yield select(selectFontSizeStep)
  const step = CARDTEXT_CONFIG.step

  let nextStep = clampCardtextFontSizeStep(currentStep)
  if (direction === 'more' && nextStep < step) nextStep++
  if (direction === 'less' && nextStep > 1) nextStep--
  nextStep = clampCardtextFontSizeStep(nextStep)

  if (nextStep !== currentStep) {
    yield put(setTextStyle({ fontSizeStep: nextStep }))

    const pxSize = STEP_TO_PX[nextStep - 1]

    // Transforms.setNodes(
    //   editor,
    //   { fontSize: pxSize },
    //   {
    //     match: (n) => SlateText.isText(n),
    //     split: true,
    //   },
    // )
  }
}

export function* syncCardtextToolbarVisuals() {
  yield call(syncFontSizeButtonsStatus)
}

export function* syncFontSizeButtonsStatus(): SagaIterator {
  const currentStep: number = yield select(selectFontSizeStep)
  const maxStep = CARDTEXT_CONFIG.step

  for (const section of CARDTEXT_FONT_TOOLBAR_SECTIONS) {
    yield put(
      updateToolbarIcon({
        section,
        key: 'fontSizeLess',
        value: currentStep <= 1 ? 'disabled' : 'enabled',
      }),
    )
    yield put(
      updateToolbarIcon({
        section,
        key: 'fontSizeMore',
        value: currentStep >= maxStep ? 'disabled' : 'enabled',
      }),
    )
  }
}

